export let generatedServiceWorkerUrl: string = null;
function generateUrl(): string {
  // Override the real Worker with a stub
  // to return the filename, which will be generated/replaced by the worker-plugin.
  // @ts-ignore
  Worker = class WorkerStub {
    constructor(public stringUrl: string, public options?: WorkerOptions) {}
  };

  const worker = new Worker(new URL("./notification.worker", import.meta.url), { type: "module" }) as any;
  generatedServiceWorkerUrl = worker.stringUrl;
  return generatedServiceWorkerUrl;
}

export const notificationWorkerConfig = {
  enabled: true,
  serviceWorkerUrl: generateUrl()
};
