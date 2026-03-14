#!/bin/bash

# R+
sed -i '' 's/<title>Detalhes do Serviço/<title>Projeto R+/g' service-details-rplus.html
sed -i '' 's/template-residencia/template-rplus/g' service-details-rplus.html
sed -i '' 's/service-details-residencia.html" class="active"/service-details-residencia.html"/g' service-details-rplus.html
sed -i '' 's/service-details-rplus.html"/service-details-rplus.html" class="active"/g' service-details-rplus.html
sed -i '' 's/Seja Aprovado na Residência Médica em 2025/Maximize Seus Resultados com o Projeto R+ Avançado/g' service-details-rplus.html
sed -i '' 's/Projeto Residência Médica<\/li>/Projeto R+<\/li>/g' service-details-rplus.html

# Faculdade
sed -i '' 's/<title>Detalhes do Serviço/<title>Projeto Faculdade/g' service-details-faculdade.html
sed -i '' 's/template-residencia/template-faculdade/g' service-details-faculdade.html
sed -i '' 's/service-details-residencia.html" class="active"/service-details-residencia.html"/g' service-details-faculdade.html
sed -i '' 's/service-details-faculdade.html"/service-details-faculdade.html" class="active"/g' service-details-faculdade.html
sed -i '' 's/Seja Aprovado na Residência Médica em 2025/Domine os 6 Anos da Faculdade de Medicina/g' service-details-faculdade.html
sed -i '' 's/Projeto Residência Médica<\/li>/Projeto Faculdade<\/li>/g' service-details-faculdade.html

# Notion
sed -i '' 's/<title>Detalhes do Serviço/<title>Versão no Notion/g' service-details-notion.html
sed -i '' 's/template-residencia/template-notion/g' service-details-notion.html
sed -i '' 's/service-details-residencia.html" class="active"/service-details-residencia.html"/g' service-details-notion.html
sed -i '' 's/service-details-notion.html"/service-details-notion.html" class="active"/g' service-details-notion.html
sed -i '' 's/Seja Aprovado na Residência Médica em 2025/Sistema Completo de Estudos no Notion/g' service-details-notion.html
sed -i '' 's/Projeto Residência Médica<\/li>/Versão no Notion<\/li>/g' service-details-notion.html

