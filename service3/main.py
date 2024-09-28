
import socket
import portpicker
from bottle import route, run
from zeroconf import IPVersion, ServiceInfo, Zeroconf

port = 0
local_ip = ""

@route("/list")
def list():
  global port, local_ip
  return { "endpoints": [
    {
      "name": "search_internet",
      "description": "Search the internet and returns list of url pages who matches. Only the url is returned not the content of the page",
      "url": f"http://{local_ip}:{port}/search",
      "parameters": [
        { "name": "q", "type": "string", "description": "The query to search for", "required": True }
      ]
    },
    {
      "name": "fetch_content",
      "description": "Get the content of a webpage given its url",
      "url": f"http://{local_ip}:{port}/content",
      "parameters": [
        { "name": "url", "type": "string", "description": "The url of the webpage", "required": True }
      ]
    }
  ]}

@route("/search")
def search():
  return { "results": [ "http://www.doesnotexist.com/butitmatches" ] }

@route("/content")
def content():
  return { "content": "<div>The songs played during the concert were:</div><ul><ol>Alien</ol><ol>>A Forest (by The Cure)</ol><ol>New Order T-Shirt</ol></ul>" }
def main() -> None:
  
  global local_ip, port

  port = portpicker.pick_unused_port()

  zeroconf = Zeroconf(ip_version=IPVersion.V4Only)

  local_ip = socket.gethostbyname(socket.gethostname())
  
  info = ServiceInfo(
    type_="_nestor._tcp.local.",
    name=f"service._nestor._tcp.local.",
    addresses=[socket.inet_aton(local_ip)],
    port=port,
    properties={
      "type": "service",
      "path": "/list"
    },
    host_ttl=10,
    other_ttl=10,
  )

  zeroconf.register_service(info)

  run(host="localhost", port=port)

if __name__ == "__main__":
  main()