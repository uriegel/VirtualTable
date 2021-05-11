extern crate chrono;

use chrono::Utc;
use warp::{Filter, Reply, fs::File, http::HeaderValue, hyper::{Body, HeaderMap, Response}};

#[tokio::main]
async fn main() {
    let port = 9865;
    println!("Running test server on http://localhost:{}/vtc", port);

    fn add_headers(reply: File)->Response<Body> {
        let mut header_map = HeaderMap::new();
        let now = Utc::now();
        let now_str = now.format("%a, %d %h %Y %T GMT").to_string();
        header_map.insert("Expires", HeaderValue::from_str(now_str.as_str()).unwrap());
        header_map.insert("Server", HeaderValue::from_str("Mein Server").unwrap());

        let mut res = reply.into_response();
        let headers = res.headers_mut();
        headers.extend(header_map);
        res
    }

    let route = 
        warp::path("vtc")
        .and(warp::fs::dir("."))
        .map(add_headers);

    //warp::serve(warp::fs::dir("/home/uwe/Projekte/VirtualTableComponent")
    warp::serve(route)
        .run(([127, 0, 0, 1], port))
        .await;        
}
