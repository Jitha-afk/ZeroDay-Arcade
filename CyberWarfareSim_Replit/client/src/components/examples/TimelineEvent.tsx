import { PERSONAS } from "@shared/schema";
import TimelineEvent from '../TimelineEvent';

export default function TimelineEventExample() {
  return (
    <div className="space-y-4 max-w-2xl p-4">
      <TimelineEvent
        id="1"
        title="Unusual Outbound Traffic Detected"
        description="SOC monitoring systems have detected anomalous data transfer patterns from Server-01. Traffic volume is 300% above baseline with destinations to unknown IP addresses."
        eventType="alert"
        severity="medium"
        targetPersonas={[PERSONAS.SOC_ANALYST, PERSONAS.SOC_LEAD]}
        scheduledTime={540} // 9:00 AM
        isTriggered={true}
        onDecision={(id, decision, reasoning) => console.log('Decision made:', { id, decision, reasoning })}
      />
      
      <TimelineEvent
        id="2"
        title="Mass File Encryption Detected"
        description="Critical alert: Ransomware activity detected across multiple file servers. Files are being encrypted with .locked extension. Immediate action required."
        eventType="decision_point"
        severity="critical"
        targetPersonas={[PERSONAS.IT_HEAD, PERSONAS.CISO]}
        scheduledTime={600} // 9:10 AM
        isTriggered={true}
        onDecision={(id, decision, reasoning) => console.log('Critical decision made:', { id, decision, reasoning })}
      />
      
      <TimelineEvent
        id="3"
        title="Help Desk Ticket Surge"
        description="IT support is receiving numerous tickets from employees unable to access files and applications. User productivity significantly impacted."
        eventType="notification"
        severity="high"
        targetPersonas={[PERSONAS.IT_HEAD, PERSONAS.PR_HEAD]}
        scheduledTime={900} // 9:15 AM
        isTriggered={false}
      />
    </div>
  );
}