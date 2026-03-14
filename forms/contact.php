<?php
/**
 * Sophos Academy - Formulário de Contato Otimizado
 * Versão: 2.0
 * Funcionalidades: Validação, Sanitização, Notificações
 */

// ===== CONFIGURAÇÕES =====
$config = [
    'receiving_email' => 'contato@sophosacademy.com',
    'from_email' => 'noreply@sophosacademy.com',
    'from_name' => 'Sophos Academy',
    'subject_prefix' => '[Sophos Academy] ',
    'enable_notifications' => true,
    'enable_auto_reply' => true,
    'max_message_length' => 1000,
    'required_fields' => ['name', 'email', 'message']
];

// ===== FUNÇÕES UTILITÁRIAS =====
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validateName($name) {
    return preg_match("/^[a-zA-ZÀ-ÿ\s]{2,50}$/", $name);
}

function logError($message) {
    $log = date('Y-m-d H:i:s') . " - " . $message . PHP_EOL;
    file_put_contents('contact_errors.log', $log, FILE_APPEND);
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

// Verificar rate limiting (simples)
session_start();
$now = time();
$last_submission = $_SESSION['last_contact_submission'] ?? 0;

if ($now - $last_submission < 60) { // 1 minuto entre submissões
    sendResponse(false, 'Aguarde um minuto antes de enviar outra mensagem');
}

// ===== VALIDAÇÃO DOS DADOS =====
$errors = [];
$data = [];

// Sanitizar dados
foreach ($_POST as $key => $value) {
    $data[$key] = sanitizeInput($value);
}

// Validar campos obrigatórios
foreach ($config['required_fields'] as $field) {
    if (empty($data[$field])) {
        $errors[] = "Campo '$field' é obrigatório";
    }
}

// Validações específicas
if (!empty($data['name']) && !validateName($data['name'])) {
    $errors[] = 'Nome deve conter apenas letras e espaços (2-50 caracteres)';
}

if (!empty($data['email']) && !validateEmail($data['email'])) {
    $errors[] = 'Email inválido';
}

if (!empty($data['message']) && strlen($data['message']) > $config['max_message_length']) {
    $errors[] = "Mensagem muito longa (máximo {$config['max_message_length']} caracteres)";
}

if (!empty($data['message']) && strlen($data['message']) < 10) {
    $errors[] = 'Mensagem muito curta (mínimo 10 caracteres)';
}

// Verificar honeypot (campo oculto para detectar bots)
if (!empty($data['website'])) {
    sendResponse(false, 'Spam detectado');
}

if (!empty($errors)) {
    sendResponse(false, 'Dados inválidos: ' . implode(', ', $errors));
}

// ===== PREPARAR EMAIL =====
$to = $config['receiving_email'];
$subject = $config['subject_prefix'] . ($data['subject'] ?? 'Nova mensagem do site');
$from_email = $config['from_email'];
$from_name = $config['from_name'];

// Corpo do email (HTML)
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #42b983, #2d9c6a); color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; }
        .field { margin-bottom: 20px; }
        .field label { font-weight: bold; color: #42b983; }
        .field value { display: block; margin-top: 5px; padding: 10px; background: white; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎓 Sophos Academy</h1>
            <p>Nova mensagem recebida pelo site</p>
        </div>
        <div class='content'>
            <div class='field'>
                <label>Nome:</label>
                <div class='value'>" . htmlspecialchars($data['name']) . "</div>
            </div>
            <div class='field'>
                <label>Email:</label>
                <div class='value'>" . htmlspecialchars($data['email']) . "</div>
            </div>
            <div class='field'>
                <label>Assunto:</label>
                <div class='value'>" . htmlspecialchars($data['subject'] ?? 'Não informado') . "</div>
            </div>
            <div class='field'>
                <label>Mensagem:</label>
                <div class='value'>" . nl2br(htmlspecialchars($data['message'])) . "</div>
            </div>
            <div class='field'>
                <label>Data/Hora:</label>
                <div class='value'>" . date('d/m/Y H:i:s') . "</div>
            </div>
            <div class='field'>
                <label>IP:</label>
                <div class='value'>" . $_SERVER['REMOTE_ADDR'] . "</div>
            </div>
            <div class='field'>
                <label>User Agent:</label>
                <div class='value'>" . htmlspecialchars($_SERVER['HTTP_USER_AGENT']) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Esta mensagem foi enviada automaticamente pelo site da Sophos Academy</p>
        </div>
    </div>
</body>
</html>
";

// Headers do email
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: ' . $from_name . ' <' . $from_email . '>',
    'Reply-To: ' . $data['name'] . ' <' . $data['email'] . '>',
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 1'
];

// ===== ENVIAR EMAIL =====
try {
    $email_sent = mail($to, $subject, $email_body, implode("\r\n", $headers));
    
    if (!$email_sent) {
        throw new Exception('Falha ao enviar email');
    }
    
    // Marcar timestamp da submissão
    $_SESSION['last_contact_submission'] = $now;
    
    // Log de sucesso
    $log_message = "Mensagem enviada com sucesso - Nome: {$data['name']}, Email: {$data['email']}";
    file_put_contents('contact_success.log', date('Y-m-d H:i:s') . " - " . $log_message . PHP_EOL, FILE_APPEND);
    
    // Enviar auto-resposta se habilitado
    if ($config['enable_auto_reply']) {
        sendAutoReply($data);
    }
    
    sendResponse(true, 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
    
} catch (Exception $e) {
    logError("Erro ao enviar email: " . $e->getMessage());
    sendResponse(false, 'Erro interno. Tente novamente mais tarde ou entre em contato diretamente.');
}

// ===== FUNÇÃO DE AUTO-RESPOSTA =====
function sendAutoReply($data) {
    global $config;
    
    $to = $data['email'];
    $subject = 'Recebemos sua mensagem - Sophos Academy';
    $from_email = $config['from_email'];
    $from_name = $config['from_name'];
    
    $auto_reply_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #42b983, #2d9c6a); color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; }
        .cta { background: #42b983; color: white; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0; }
        .cta a { color: white; text-decoration: none; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎓 Sophos Academy</h1>
            <p>Obrigado por entrar em contato!</p>
        </div>
        <div class='content'>
            <p>Olá <strong>" . htmlspecialchars($data['name']) . "</strong>,</p>
            
            <p>Recebemos sua mensagem e ficamos muito felizes com seu interesse na Sophos Academy!</p>
            
            <p>Nossa equipe analisará sua solicitação e retornará o contato em até 24 horas úteis.</p>
            
            <p>Enquanto isso, que tal conhecer mais sobre nossos métodos de estudo?</p>
            
            <div class='cta'>
                <a href='https://sophosacademy.com' target='_blank'>Explore nossos serviços</a>
            </div>
            
            <p><strong>Sua mensagem:</strong></p>
            <blockquote style='background: white; padding: 15px; border-left: 4px solid #42b983; margin: 15px 0;'>
                " . nl2br(htmlspecialchars($data['message'])) . "
            </blockquote>
            
            <p>Se precisar de atendimento urgente, entre em contato:</p>
            <ul>
                <li>📱 WhatsApp: (51) 99999-9999</li>
                <li>📧 Email: contato@sophosacademy.com</li>
                <li>🕒 Horário: Segunda a Sexta, 9h às 18h</li>
            </ul>
            
            <p>Atenciosamente,<br>
            <strong>Equipe Sophos Academy</strong></p>
        </div>
        <div class='footer'>
            <p>Esta é uma mensagem automática. Não responda este email.</p>
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
    
    mail($to, $subject, $auto_reply_body, implode("\r\n", $headers));
}
?>
