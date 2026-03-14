FROM nginx:alpine

# Copiar arquivos do website
COPY . /usr/share/nginx/html/

# Remover arquivos desnecessários
RUN rm -rf /usr/share/nginx/html/.git \
    /usr/share/nginx/html/.history \
    /usr/share/nginx/html/.DS_Store \
    /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/.claude

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 8080 (Cloud Run usa 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]