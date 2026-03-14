<?php
/**
 * Sophos Academy - Sistema de Newsletter Otimizado
 * Versão: 2.0
 * Funcionalidades: Validação, Anti-spam, Integração com MailChimp
 */

// ===== CONFIGURAÇÕES =====
$config = [
    'mailchimp_api_key' => '', // Adicionar chave da API do MailChimp
    'mailchimp_list_id' => '', // ID da lista no MailChimp
    'admin_email' => 'contato@sophosacademy.com',
    'enable_double_optin' => true,
    'enable_notifications' => true,
    'csv_file' => 'newsletter_subscribers.csv'
];

// ===== FUNÇÕES UTILITÁRIAS =====
function sanitizeEmail($email) {
    return filter_var(trim($email), FILTER_SANITIZE_EMAIL);
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function isEmailExists($email) {
    global $config;
    
    if (!file_exists($config['csv_file'])) {
        return false;
    }
    
    $handle = fopen($config['csv_file'], 'r');
    while (($data = fgetcsv($handle)) !== FALSE) {
        if (isset($data[0]) && $data[0] === $email) {
            fclose($handle);
            return true;
        }
    }
    fclose($handle);
    return false;
}

function saveSubscriber($email, $source = 'website') {
    global $config;
    
    $data = [
        $email,
        date('Y-m-d H:i:s'),
        $source,
        $_SERVER['REMOTE_ADDR'],
        $_SERVER['HTTP_USER_AGENT'] ?? ''
    ];
    
    $handle = fopen($config['csv_file'], 'a');
    fputcsv($handle, $data);
    fclose($handle);
}

function sendWelcomeEmail($email) {
    global $config;
    
    $subject = 'Bem-vindo à Sophos Academy! 🎓';
    $from_email = 'noreply@sophosacademy.com';
    $from_name = 'Sophos Academy';
    
    $welcome_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #42b983, #2d9c6a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px; }
        .welcome-badge { background: #42b983; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 20px 0; }
        .benefits { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; }
        .benefit-item { display: flex; align-items: center; margin: 15px 0; }
        .benefit-icon { background: #e8f5e8; color: #42b983; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; }
        .cta-button { background: #42b983; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 20px 0; font-weight: bold; }
        .social-links { text-align: center; margin: 30px 0; }
        .social-links a { display: inline-block; margin: 0 10px; color: #42b983; text-decoration: none; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎓 Sophos Academy</h1>
            <h2>Bem-vindo à nossa comunidade!</h2>
            <p>Você acabou de dar o primeiro passo para transformar seus estudos</p>
        </div>
        
        <div class='content'>
            <div class='welcome-badge'>
                ✨ Inscrição confirmada com sucesso!
            </div>
            
            <p>Olá!</p>
            
            <p>Ficamos muito felizes em ter você conosco na <strong>Sophos Academy</strong>! Você agora faz parte de uma comunidade de estudantes dedicados que estão transformando sua forma de aprender.</p>
            
            <div class='benefits'>
                <h3>🎯 O que você vai receber:</h3>
                
                <div class='benefit-item'>
                    <div class='benefit-icon'>📚</div>
                    <div>
                        <strong>Dicas exclusivas de estudo</strong><br>
                        Metodologias científicas para otimizar seu aprendizado
                    </div>
                </div>
                
                <div class='benefit-item'>
                    <div class='benefit-icon'>🧠</div>
                    <div>
                        <strong>Técnicas de Second Brain</strong><br>
                        Como organizar e conectar seu conhecimento
                    </div>
                </div>
                
                <div class='benefit-item'>
                    <div class='benefit-icon'>⚡</div>
                    <div>
                        <strong>Estratégias de revisão espaçada</strong><br>
                        Maximize sua retenção de longo prazo
                    </div>
                </div>
                
                <div class='benefit-item'>
                    <div class='benefit-icon'>🎯</div>
                    <div>
                        <strong>Conteúdo exclusivo para assinantes</strong><br>
                        Acesso antecipado a novos recursos e ferramentas
                    </div>
                </div>
                
                <div class='benefit-item'>
                    <div class='benefit-icon'>💡</div>
                    <div>
                        <strong>Cases de sucesso reais</strong><br>
                        Histórias inspiradoras de aprovações
                    </div>
                </div>
            </div>
            
            <p>Para começar, que tal conhecer nossos projetos mais populares?</p>
            
            <div style='text-align: center;'>
                <a href='https://sophosacademy.com' class='cta-button'>Explorar Nossos Projetos</a>
            </div>
            
            <div class='benefits'>
                <h3>🚀 Próximos passos:</h3>
                <ol>
                    <li><strong>Explore nosso site</strong> - Conheça todos os projetos disponíveis</li>
                    <li><strong>Siga-nos nas redes sociais</strong> - Receba dicas diárias</li>
                    <li><strong>Entre em nosso grupo VIP</strong> - Conecte-se com outros estudantes</li>
                    <li><strong>Agende uma consultoria gratuita</strong> - Vamos criar seu plano personalizado</li>
                </ol>
            </div>
            
            <div class='social-links'>
                <h3>📱 Siga-nos nas redes sociais:</h3>
                <a href='#'>📘 Facebook</a>
                <a href='#'>📷 Instagram</a>
                <a href='#'>🐦 Twitter</a>
                <a href='#'>💼 LinkedIn</a>
                <a href='#'>📺 YouTube</a>
            </div>
            
            <p><strong>Dúvidas ou sugestões?</strong><br>
            Responda este email ou entre em contato:</p>
            
            <ul>
                <li>📱 WhatsApp: (51) 99999-9999</li>
                <li>📧 Email: contato@sophosacademy.com</li>
                <li>🌐 Site: sophosacademy.com</li>
            </ul>
            
            <p>Estamos ansiosos para acompanhar sua jornada de sucesso!</p>
            
            <p>Com carinho,<br>
            <strong>Equipe Sophos Academy</strong> 💚</p>
        </div>
        
        <div class='footer'>
            <p>Você está recebendo este email porque se inscreveu em nossa newsletter.</p>
            <p>Se não deseja mais receber nossos emails, <a href='#'>clique aqui para cancelar</a>.</p>
            <p>Sophos Academy - Transformando a educação médica</p>
        </div>
    </div>
</body>
</html>
    ";
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $from_name . ' <' . $from_email . '>',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    return mail($email, $subject, $welcome_body, implode("\r\n", $headers));
}

function notifyAdmin($email) {
    global $config;
    
    $subject = '[Sophos Academy] Nova inscrição na newsletter';
    $message = "Nova inscrição na newsletter:\n\n";
    $message .= "Email: $email\n";
    $message .= "Data: " . date('d/m/Y H:i:s') . "\n";
    $message .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $message .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'N/A') . "\n";
    
    mail($config['admin_email'], $subject, $message);
}

function sendResponse($success, $message, $data = null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('c')
    ]);
    exit;
}

// ===== VERIFICAÇÕES DE SEGURANÇA =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Método não permitido');
}

// Rate limiting simples
session_start();
$now = time();
$last_subscription = $_SESSION['last_newsletter_subscription'] ?? 0;

if ($now - $last_subscription < 30) { // 30 segundos entre inscrições
    sendResponse(false, 'Aguarde um momento antes de se inscrever novamente');
}

// ===== VALIDAÇÃO DOS DADOS =====
$email = sanitizeEmail($_POST['email'] ?? '');

if (empty($email)) {
    sendResponse(false, 'Email é obrigatório');
}

if (!validateEmail($email)) {
    sendResponse(false, 'Email inválido');
}

// Verificar se já está inscrito
if (isEmailExists($email)) {
    sendResponse(false, 'Este email já está inscrito em nossa newsletter');
}

// Verificar honeypot
if (!empty($_POST['website'])) {
    sendResponse(false, 'Spam detectado');
}

// ===== PROCESSAR INSCRIÇÃO =====
try {
    // Salvar no CSV
    saveSubscriber($email, 'newsletter');
    
    // Marcar timestamp
    $_SESSION['last_newsletter_subscription'] = $now;
    
    // Enviar email de boas-vindas
    if ($config['enable_double_optin']) {
        $welcome_sent = sendWelcomeEmail($email);
        if (!$welcome_sent) {
            error_log("Falha ao enviar email de boas-vindas para: $email");
        }
    }
    
    // Notificar admin
    if ($config['enable_notifications']) {
        notifyAdmin($email);
    }
    
    // Log de sucesso
    $log_message = "Nova inscrição na newsletter: $email";
    file_put_contents('newsletter_success.log', date('Y-m-d H:i:s') . " - " . $log_message . PHP_EOL, FILE_APPEND);
    
    // Resposta de sucesso
    $response_message = $config['enable_double_optin'] 
        ? 'Inscrição realizada com sucesso! Verifique seu email para confirmar.'
        : 'Inscrição realizada com sucesso! Bem-vindo à Sophos Academy!';
    
    sendResponse(true, $response_message, [
        'email' => $email,
        'double_optin' => $config['enable_double_optin']
    ]);
    
} catch (Exception $e) {
    error_log("Erro na inscrição da newsletter: " . $e->getMessage());
    sendResponse(false, 'Erro interno. Tente novamente mais tarde.');
}

// ===== INTEGRAÇÃO COM MAILCHIMP (OPCIONAL) =====
function subscribeToMailchimp($email) {
    global $config;
    
    if (empty($config['mailchimp_api_key']) || empty($config['mailchimp_list_id'])) {
        return false;
    }
    
    $data = [
        'email_address' => $email,
        'status' => $config['enable_double_optin'] ? 'pending' : 'subscribed',
        'merge_fields' => [
            'FNAME' => '',
            'LNAME' => ''
        ],
        'tags' => ['website-signup']
    ];
    
    $datacenter = substr($config['mailchimp_api_key'], strpos($config['mailchimp_api_key'], '-') + 1);
    $url = "https://{$datacenter}.api.mailchimp.com/3.0/lists/{$config['mailchimp_list_id']}/members";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Basic ' . base64_encode('user:' . $config['mailchimp_api_key']),
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Sophos Academy Newsletter');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return $http_code === 200;
}
?>
