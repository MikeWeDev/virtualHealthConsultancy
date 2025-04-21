// components/VideoCall/JitsiCall.tsx

import { useEffect } from 'react';

const JitsiCall = () => {
  useEffect(() => {
    const domain = 'meet.jit.si';  // Change to your Jitsi server if you have a custom one
    const roomName = 'TestRoom';   // You can generate this dynamically or pass it as a prop

    const options = {
      roomName,
      parentNode: document.getElementById('jitsi-container'),
      width: '100%',
      height: '600px',
      interfaceConfigOverwrite: {
        filmStripOnly: false,
      },
    };

    const api = new (window as any).JitsiMeetExternalAPI(domain, options);
  }, []);

  return (
    <div id="jitsi-container" className="w-full h-full bg-gray-200 rounded-lg shadow-md"></div>
  );
};

export default JitsiCall;
