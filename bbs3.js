import { Server } from "https://js.sabae.cc/Server.js";
import { JSONDB } from "https://js.sabae.cc/JSONDB.js";

const bbs = new JSONDB("bbs.json");

class MyServer extends Server {
  api(path, req, remoteAddr) {
    if (!remoteAddr.startsWith("fc")) {
      return null; // is not Internet3
    }
    if (path == "/api/list") {
      return bbs.data;
    } else if (path == "/api/add") {
      req.addr = remoteAddr;
      bbs.data.push(req);
      bbs.write();
      return "ok";
    } else if (path == "/api/remove") {
      const idx = bbs.data.findIndex(d => d.addr == remoteAddr && d.date == req.date);
      if (idx < 0) {
        return null;
      }
      bbs.data.splice(idx, 1);
      bbs.write();
      return "ok";
    }
  }
}

const port = Deno.args[0] || 8001;
new MyServer(port);
