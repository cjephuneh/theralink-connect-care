// src/pages/VideoCallPage.tsx

import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const VideoCallPage = () => {
  const { therapistId } = useParams();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const domain = 'meet.jit.si'; // Public Jitsi server
    const options = {
      roomName: `TherapySession-${therapistId}`, // Unique room per therapist
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY: false,
      },
      configOverwrite: {
        prejoinPageEnabled: false,
      },
      userInfo: {
        displayName: 'Therapist or Client',
      },
    };

    const api = new (window as any).JitsiMeetExternalAPI(domain, options);

    return () => {
      api.dispose();
    };
  }, [therapistId]);

  return (
    <div className="h-screen w-full">
      <div ref={jitsiContainerRef} className="h-full w-full" />
    </div>
  );
};

export default VideoCallPage;
