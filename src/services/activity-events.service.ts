import { ActivityEvent } from "@/types";
import { getActivityEventsData, setActivityEventsData } from "@/test-utils/activity-events.dummy";
import { ActivityEventType } from "@/types";

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getRecentActivity(): Promise<ActivityEvent[]> {
  await simulateNetworkDelay();
  const activityEvents = getActivityEventsData();
  const sorted = [...activityEvents].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  return sorted;
}

export async function addActivityEvent({type, label}: {type: ActivityEventType, label: string}) {
  await simulateNetworkDelay();
  const trimmedLabel = label.trim();
  if (!trimmedLabel) {
    throw new Error("Activity label is required");
  }  
  const activityEvents = getActivityEventsData();
  const newEvent: ActivityEvent = {
    id: crypto.randomUUID(),
    type,
    label: trimmedLabel,
    occurredAt: new Date().toISOString(),
  };
  setActivityEventsData([newEvent, ...activityEvents]);
  return newEvent;
}