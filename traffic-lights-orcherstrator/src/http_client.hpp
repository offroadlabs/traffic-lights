#ifndef HTTP_CLIENT_HPP
#define HTTP_CLIENT_HPP

#include <zephyr/kernel.h>
#include <zephyr/net/socket.h>
#include <zephyr/net/http/client.h>

class HttpClient
{
public:
    HttpClient();
    ~HttpClient();

    void send_traffic_light_state(const char *id, const char *state);

private:
    int setup_connection();
    static void response_callback(struct http_response *rsp,
                                  enum http_final_call final_data,
                                  void *user_data);
};

#endif