#include "http_client.hpp"
#include <zephyr/logging/log.h>
#include <string.h>
#include <stdio.h>

LOG_MODULE_REGISTER(http_client, LOG_LEVEL_INF);

#define HTTP_PORT 8000
#define SERVER_ADDR CONFIG_NET_CONFIG_PEER_IPV4_ADDR
#define MAX_RECV_BUF_LEN 512

HttpClient::HttpClient() {}
HttpClient::~HttpClient() {}

static uint8_t recv_buf[MAX_RECV_BUF_LEN];

void HttpClient::response_callback(struct http_response *rsp,
                                   enum http_final_call final_data,
                                   void *user_data)
{
    if (final_data == HTTP_DATA_MORE)
    {
        LOG_INF("Données partielles reçues (%zd bytes)", rsp->data_len);
        LOG_INF("Contenu: %.*s", rsp->data_len, (char *)rsp->recv_buf);
    }
    else if (final_data == HTTP_DATA_FINAL)
    {
        LOG_INF("Toutes les données reçues (%zd bytes)", rsp->data_len);
        LOG_INF("Contenu final: %.*s", rsp->data_len, (char *)rsp->recv_buf);
    }

    LOG_INF("Statut de la réponse: %d %s",
            rsp->http_status_code,
            rsp->http_status);
}

int HttpClient::setup_connection()
{
    struct sockaddr_in addr;
    int sock;

    sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (sock < 0)
    {
        LOG_ERR("Échec de la création du socket (%d)", -errno);
        return -errno;
    }

    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(HTTP_PORT);
    inet_pton(AF_INET, SERVER_ADDR, &addr.sin_addr);

    int ret = connect(sock, (struct sockaddr *)&addr, sizeof(addr));
    if (ret < 0)
    {
        LOG_ERR("Échec de la connexion au serveur (%d)", -errno);
        close(sock);
        return -errno;
    }

    return sock;
}

void HttpClient::send_traffic_light_state(const char *id, const char *state)
{
    int sock;
    int32_t timeout = 3 * MSEC_PER_SEC;
    char payload[128];
    char content_len[64];

    // Création du payload JSON
    snprintf(payload, sizeof(payload), "{\"id\":\"%s\",\"state\":\"%s\"}", id, state);
    snprintf(content_len, sizeof(content_len), "Content-Length: %d\r\n", strlen(payload));

    // Configuration de la connexion
    sock = setup_connection();
    if (sock < 0)
    {
        LOG_ERR("Échec de la configuration de la connexion");
        return;
    }

    // Préparation de la requête HTTP
    struct http_request req;
    memset(&req, 0, sizeof(req));

    const char *headers[] = {
        "Content-Type: application/json\r\n",
        content_len,
        NULL};

    req.method = HTTP_POST;
    req.url = "/traffic-light";
    req.host = SERVER_ADDR;
    req.protocol = "HTTP/1.1";
    req.header_fields = headers;
    req.payload = payload;
    req.payload_len = strlen(payload);
    req.response = response_callback;
    req.recv_buf = recv_buf;
    req.recv_buf_len = sizeof(recv_buf);

    // Envoi de la requête
    LOG_INF("Envoi de l'état du feu tricolore %s: %s", id, state);
    LOG_INF("Payload: %s", payload);

    int ret = http_client_req(sock, &req, timeout, NULL);
    if (ret < 0)
    {
        LOG_ERR("Échec de l'envoi de l'état du feu tricolore (err: %d)", ret);
    }

    // Fermeture de la connexion
    close(sock);
}