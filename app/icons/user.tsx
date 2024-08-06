import * as React from "react"
import { SVGProps } from "react"
const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-circle-user"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <circle cx={12} cy={10} r={3} />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
)
export default UserIcon
