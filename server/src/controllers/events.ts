import { NextFunction, Request, Response } from "express";
let clients = [] as any[];

export function sendEvent(event: Object) {
    const data = `data: ${JSON.stringify(event)}\n\n`;

    clients.forEach((c)=>{c.response.write(data)});
}

export function eventsHandler(request: Request, response: Response): void  {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
    const data = `data: ${JSON.stringify({type: "ACK"})}\n\n`;

    response.write(data);
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response,
      email: request.params.email,
    };
    console.log(newClient.email);
    
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
  }

  export function getOnlineUsers(request: Request, response: Response): void  {
    const users = clients.map((c) => {return c.email});
    response.json(users);
  }