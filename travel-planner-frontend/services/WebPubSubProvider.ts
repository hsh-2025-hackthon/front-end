import { WebPubSubClient } from "@azure/web-pubsub-client";
import * as Y from "yjs";
import { awarenessProtocol, Awareness } from 'y-protocols/awareness';

const messageType = {
  sync: 0,
  awareness: 1,
};

export class WebPubSubProvider {
  private client: WebPubSubClient;
  private doc: Y.Doc;
  private awareness: Awareness;

  constructor(connectionString: string, hub: string, private groupId: string, doc: Y.Doc) {
    this.doc = doc;
    this.awareness = new Awareness(doc);

    this.client = new WebPubSubClient(connectionString, {
      hub,
      autoReconnect: true,
    });

    this.client.on("group-message", (e) => {
      const message = JSON.parse(e.data as string);
      if (message.group === this.groupId) {
        if (message.type === messageType.sync) {
          Y.applyUpdate(this.doc, new Uint8Array(message.payload), this);
        } else if (message.type === messageType.awareness) {
          awarenessProtocol.applyAwarenessUpdate(this.awareness, new Uint8Array(message.payload), this);
        }
      }
    });

    this.doc.on("update", (update: Uint8Array, origin: any) => {
      if (origin !== this) {
        this.client.sendToGroup(this.groupId, JSON.stringify({
          type: messageType.sync,
          group: this.groupId,
          payload: Array.from(update),
        }), "json");
      }
    });

    this.awareness.on('update', ({ added, updated, removed }: any, origin: any) => {
      const changedClients = added.concat(updated).concat(removed);
      const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients);
      this.client.sendToGroup(this.groupId, JSON.stringify({
        type: messageType.awareness,
        group: this.groupId,
        payload: Array.from(awarenessUpdate),
      }), "json");
    });
  }

  public async connect() {
    await this.client.start();
    await this.client.joinGroup(this.groupId);
  }

  public disconnect() {
    this.client.leaveGroup(this.groupId);
    this.client.stop();
  }
}
