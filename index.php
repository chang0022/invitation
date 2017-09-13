<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';

$config['displayErrorDetails'] = true;
$config['db']['host']   = "localhost";
$config['db']['user']   = "root";
$config['db']['pass']   = "chang48956";
$config['db']['dbname'] = "invitation";

$app = new \Slim\App(["settings" => $config]);

$container = $app->getContainer();

$container['view'] = function ($c) {
    $view = new \Slim\Views\Twig(__DIR__ . '/templates', [
        'cache' => __DIR__ . '/cache'
        // 'cache' => false
    ]);

    $basePath = rtrim(str_ireplace('index.php', '', $c['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new Slim\Views\TwigExtension($c['router'], $basePath));

    return $view;
};

$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler(__DIR__ . '/logs/app.log');
    $logger->pushHandler($file_handler);
    return $logger;
};

$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO("mysql:host=" . $db['host'] . ";dbname=" . $db['dbname'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};


$app->get('/', function (Request $request, Response $response, $args) {
    return $this->view->render($response, 'index.twig', [
        'assets' => $request->getUri()->getBaseUrl() . '/assets',
        'page' => '',
        'timestamp' => strtotime(date('Y-m-d h:i:sa'))
    ]);
});


$app->get('/girl', function (Request $request, Response $response, $args) {
    return $this->view->render($response, 'index.twig', [
        'assets' => $request->getUri()->getBaseUrl() . '/assets',
        'page' =>  'girl',
        'timestamp' => strtotime(date('Y-m-d h:i:sa'))
    ]);
});

$app->get('/poster', function (Request $request, Response $response, $args) {
    return $this->view->render($response, 'poster.twig', [
        'assets' => $request->getUri()->getBaseUrl() . '/assets',
        'timestamp' => strtotime(date('Y-m-d h:i:sa'))
    ]);
});

$app->post('/visitor', function (Request $request, Response $response, $args) {
    try {
        $data = $request->getParsedBody();

        $visitor = $this->db->prepare("INSERT INTO `invitation`.`visitor` (`name`, `number`, `blessing`, `type`, `belong`) VALUES (:name, :number, :blessing, :type, :belong);");

        $visitor->bindParam(':name', $data['name'], PDO::PARAM_INT);
        $visitor->bindParam(':number', $data['number'], PDO::PARAM_INT);
        $visitor->bindParam(':blessing', $data['blessing'], PDO::PARAM_INT);
        $visitor->bindParam(':type', $data['type'], PDO::PARAM_INT);
        $visitor->bindParam(':belong', $data['belong'], PDO::PARAM_INT);
        $visitor->execute();

        $response = $response->withStatus(200)->withHeader('Content-type', 'application/json');
        $response->getBody()->write(json_encode(
            [
                'code' => 200,
                'message' => 'OK',
                'data' => null
            ]
        ));
        return $response;
    } catch(PDOException $e) {
        $response = $response->withStatus(500)->withHeader('Content-type', 'application/json');
        $response->getBody()->write(json_encode(
            [
                'code' => 500,
                'message' => $e->getMessage(),
                'data' => null
            ]
        ));
        return $response;
    }

});

$app->get('/barrage/{type}', function (Request $request, Response $response, $args) {
    try {
        $data = $request->getParsedBody();

        $blesses = $this->db->prepare("SELECT `blessing` FROM `invitation`.`visitor` WHERE `type` = :type;");
        $blesses->bindParam(':type', $args['type'], PDO::PARAM_INT);
        $blesses->execute();
        $blessings = $blesses->fetchAll(PDO::FETCH_COLUMN, 0);

        $response = $response->withStatus(200)->withHeader('Content-type', 'application/json');
        $response->getBody()->write(json_encode(
            [
                'code' => 200,
                'message' => 'OK',
                'data' => $blessings
            ]
        ));
        return $response;
    } catch(PDOException $e) {
        $response = $response->withStatus(500)->withHeader('Content-type', 'application/json');
        $response->getBody()->write(json_encode(
            [
                'code' => 500,
                'message' => $e->getMessage(),
                'data' => null
            ]
        ));
        return $response;
    }

});

$app->run();