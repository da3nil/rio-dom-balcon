<?php

$msg = [];
$msg['success'] = 0;

if (!empty($_POST)) {
    $err = [];

    echo json_encode(var_export($_POST));

    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $city = $_POST['city'];
    $messenger = $_POST['messenger'];
    $type = $_POST['type'];
    $serv = $_POST['serv'];
    $material = $_POST['material'];

    htmlspecialchars_decode($name);
    htmlspecialchars_decode($phone);
    htmlspecialchars_decode($city);
    htmlspecialchars_decode($messenger);
    htmlspecialchars_decode($type);
    htmlspecialchars_decode($serv);
    htmlspecialchars_decode($material);

    $message = "
        <h1>Заявка на расчет стоимости остекления или утепления балкона от rio-dom.ru/balcony</h1>
        <p>
            <b>Имя:</b>
            <span>$name</span>
        </p>
        <p>
            <b>Номер телефона:</b>
            <span>$phone</span>
        </p>
        <p>
            <b>Мессенджер:</b>
            <span>$messenger</span>
        </p>
        <p>
            <b>Город:</b>
            <span>$city</span>
        </p>
        <p>
            <b>Тип балкона:</b>
            <span>$type</span>
        </p>
        <p>
            <b>Материал:</b>
            <span>$material</span>
        </p>
        <p>
            <b>Строительная подготовка:</b>
            <span>$serv</span>
        </p>
      
    ";

    $result = mail(
        'd.prytckov@yandex.ru, riodom.info@gmail.com',
        'Получена заявка', $message,
        "From: support@rio-dom.ru\r\n"
        . "Content-type: text/html; charset=utf-8\r\n"
        . "X-Mailer: PHP mail script"
    );

    if ($result) {
        $msg['msg'] = 'Ваша заявка принята. Ожидайте звонка.';
        $msg['success'] = 1;
        echo json_encode($msg);
    } else {
        $msg['msg'] = 'Ошибка отправки письма. Попробуйте позже.';
        echo json_encode($msg);
    }
} else {
    $msg['msg'] = 'Ошибка отправки письма. Данные не получены.';
    echo json_encode($msg);
}
