import { Info } from 'lucide-react'
import React from 'react'

const Snackbar = ({text}) => {
  return (
    <div className="text-primaryYellow font-gridular flex items-center gap-1 h-full px-4">
        <Info size={20}/> {text}
    </div>
  )
}

export default Snackbar