import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Topnav from '../../component/topnav';
import LeftNav from './leftnav/leftnav';
import "./homepage.css";
import { faShoppingCart, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeartIcon from '@/app/icons/hear';
import ShopIcon from '@/app/icons/shop';
import HeartWithCounter from '@/app/component/reaction/reaction';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/events');
        console.log(data);
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Unexpected data format:', data);
          setError('Unexpected data format.');
        }
      } catch (error) {
        console.error('Failed to fetch events:', error.response ? error.response.data : error.message);
        setError('Failed to fetch events.');
      }
    };

    fetchEvents();
  }, []);
  return (
    <div className="contenuePage">
      <Topnav />
      <div className="left">
        <LeftNav/>
      </div>

      <div className="conte">
        <div className="afficheEVEnement">
            {Array.isArray(events) ? (
              [...events].reverse().map((event, index) => {
                // Debugging output
                console.log('Event:', event);

                // Ensure event.date and event.time are valid
                const eventDate = new Date(event.date);
                const eventTime = new Date(`${event.date}T${event.time}`);
                const formattedTime = isNaN(eventTime.getTime()) ? 'Invalid Time' : eventTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={index} className="event">
                    <div className="infoOrga">
                      <img className="profileImage" src="./user.jpg" alt="Profile" />
                      <p className="UserOrganisateur">KexEvent</p>
                    </div>
                    <h3 className='titreEvenement'>{event.title}</h3>
                    <p className='DateEvenement'>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p className='HeureEvenement'>Heure: {event.time}</p>
                    <p className='TypeEvenement'>Type: {event.type}</p>
                    <p className='LieuEvenement'>Lieu: {event.location || 'Non spécifié'}</p>
                    <p className='PromotionEvenement'>{event.promotion}</p>
                    <div className="DivImage">
                      {event.image && <img className='imageEvenement' src={`http://localhost:3000/uploads/${event.image}`} alt={event.title} />}
                    </div>              
                    <div className="reactions">
                      <HeartWithCounter className="heartIcon" />
                      <ShopIcon className="shoppingIcon" />
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No events found.</p>
            )}

        </div> 
      </div>
      
      
    </div>
  );
}
