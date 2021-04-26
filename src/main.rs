use warp::Filter;

#[tokio::main]
async fn main() {
    let port = 9865;
    println!("Running test server on http://localhost:{}", port);

    let route1 = warp::path!("hello" / String)
    .map(|name| {
        format!("Hello, {}!", name)
    });

    //let route1 = warp::path("web").and(warp::fs::dir("/home/uwe/Projekte/WebComponents"));
    let route2 = warp::fs::dir("/home/uwe/Projekte/VirtualTableComponent");
    let routes = route1.or(route2);

    //warp::serve(warp::fs::dir("/home/uwe/Projekte/VirtualTableComponent")
    warp::serve(routes)
        .run(([127, 0, 0, 1], port))
        .await;        
}
