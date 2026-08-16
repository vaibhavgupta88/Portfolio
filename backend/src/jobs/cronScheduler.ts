import cron from 'node-cron';
import { runMonitoringCycleForAllActiveWebsites } from '../services/monitoringEngine';

export function startCronScheduler() {
  console.log('[Scheduler] Initializing automated health monitoring cron job (every minute)...');
  
  // Run every minute: '* * * * *'
  cron.schedule('* * * * *', async () => {
    console.log('[Scheduler] Minute trigger: executing global website checks...');
    await runMonitoringCycleForAllActiveWebsites();
  });
}
