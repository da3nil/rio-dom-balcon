<?php

$msg = [];
$msg['success'] = 0;

if (!empty($_POST)) {
    $err = [];

    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $city = $_POST['city'];

    if (empty($name)) {
        $err[] = "Поле 'имя' должно быть заполнено";
    }

    if (empty($phone)) {
        $err[] = "Поле 'номер телефона' должно быть заполнено";
    }
    
    if (empty($city)) {
        $city = "Не выбран";
    }


//
    if (count($err) > 0) {
        $msg['msg'] = 'Ошибка отправки формы: ';
        $msg['errors'] = $err;
        echo json_encode($msg);
        die();
    }

    htmlspecialchars_decode($name);
    htmlspecialchars_decode($phone);
    htmlspecialchars_decode($city);
    
    $message = "
        <h1>Заявка на обратный звонок от rio-dom.ru/balcony</h1>
        <hr>
        <p>
            <b>Имя:</b>
            <span>$name</span>
        </p>
        <p>
            <b>Номер телефона:</b>
            <span>$phone</span>
        </p>
        <p>
            <b>Город:</b>
            <span>$city</span>
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
