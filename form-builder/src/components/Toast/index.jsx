import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export function Toast({ message, type, onClose }) {
 useEffect(() => {
   const timer = setTimeout(onClose, 3000);
   return () => clearTimeout(timer);
 }, [onClose]);

 const styles = {
   success: {
     bg: "bg-green-100",
     border: "border-green-500",
     text: "text-green-700",
     icon: <CheckCircle className="w-5 h-5" />
   },
   error: {
     bg: "bg-red-100",
     border: "border-red-500", 
     text: "text-red-700",
     icon: <XCircle className="w-5 h-5" />
   },
   warning: {
     bg: "bg-yellow-100",
     border: "border-yellow-500",
     text: "text-yellow-700",
     icon: <AlertCircle className="w-5 h-5" />
   },
   info: {
     bg: "bg-blue-100",
     border: "border-blue-500",
     text: "text-blue-700",
     icon: <Info className="w-5 h-5" />
   }
 };

 const style = styles[type];

 return (
   <div
     className={`fixed bottom-4 right-4 p-4 border-l-4 rounded-lg shadow-lg transition-all duration-300 ${style.bg} ${style.border} ${style.text}`}
   >
     <div className="flex items-center gap-3">
       {style.icon}
       <p className="font-medium">{message}</p>
     </div>
   </div>
 );
}

Toast.propTypes = {
 message: PropTypes.string.isRequired,
 type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
 onClose: PropTypes.func.isRequired
};