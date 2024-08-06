// pages/api/events.js

import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

async function handleGet(req, res) {
  try {
    const events = await prisma.event.findMany();
    // Format the date and time
    const formattedEvents = events.map(event => ({
      ...event,
      date: formatDate(event.date),
      time: formatTime(event.time)
    }));
    console.log('GET Response:', formattedEvents);
    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
}

async function handlePost(req, res) {
  console.log('Handling POST request');
  const form = formidable({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    console.log('Form fields:', fields);
    console.log('Files:', files);

    const { title, date, time, type, location, promotion } = fields;
    const image = files.image ? files.image[0].newFilename : null;

    const titleValue = Array.isArray(title) ? title[0] : title;
    const dateValue = Array.isArray(date) ? new Date(date[0]) : new Date(date);
    const timeValue = Array.isArray(time) ? time[0] : time;

    // Combine date and time into a single DateTime string
    const dateTimeString = `${dateValue.toISOString().split('T')[0]}T${timeValue || '00:00'}:00Z`;
    const dateTimeValue = new Date(dateTimeString);

    const typeValue = Array.isArray(type) ? type[0] : type;
    const locationValue = Array.isArray(location) ? location[0] : location;
    const promotionValue = Array.isArray(promotion) ? promotion[0] : promotion;

    console.log('Parsed values:', {
      title: titleValue,
      date: dateValue,
      time: dateTimeValue,
      type: typeValue,
      location: locationValue,
      promotion: promotionValue,
      image: image,
    });

    // Verify the upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    try {
      const event = await prisma.event.create({
        data: {
          title: titleValue,
          date: dateValue,
          time: dateTimeValue,
          type: typeValue,
          location: locationValue || null, // Handle optional field
          promotion: promotionValue || null, // Handle optional field
          image,
        },
      });
      console.log('POST Response:', event);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    }
  });
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
