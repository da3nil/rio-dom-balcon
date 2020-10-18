<?php

$msg = [];
$msg['success'] = 0;

if (!empty($_POST)) {
    $err = [];

    $name = $_POST['name'];

    if (empty($name)) {
        $err[] = "Поле 'имя' должно быть заполнено";
    }

    htmlspecialchars_decode($name);

    $name = ucfirst($name);

    $link = mysqli_connect('localhost', 'admin', 'password', 'riodom2');

    if (!$link) {
        die("Ошибка соединения");
    }
    mysqli_query($link, 'SET NAMES "utf8"');
    $query = "SELECT name FROM city where name LIKE lower('" . $name . "%') LIMIT 6";

    $result = [];

    $sql = mysqli_query($link, $query);

    if ($sql !== false) {
        while ($row = mysqli_fetch_array($sql, MYSQLI_ASSOC)) {
            $result[] = $row['name'];
        }
    }

    mysqli_close($link);

    header('content-type: text/plain; charset=utf-8');
    if ($result) {
        echo json_encode($result);
    } else {
        echo json_encode([]);
    }
} else {
    $msg['msg'] = 'Ошибка отправки формы.';
    echo json_encode($msg);
}
