// 81424 Filip Lysiak
// Zadeklarowanie wymaganych modułów: express i path(do obsługi ścieżek)
const express = require("express");
var path = require("path");

// Inicjalizacja aplikacji Express
const app = express();

// Zadeklarowanie funkcji do autentykacji
function authentication(req, res, next) {
  // Pobranie nagłówka autoryzacyjnego z zapytania HTTP
  var authheader = req.headers.authorization;
  console.log(req.headers);

  // Sprawdzenie czy nagłówek autoryzacyjny istnieje
  if (!authheader) {
    // Kiedy nagłówek nie istnieje, zwrócenie błędu autentykacji
    var err = new Error("You are not authenticated!");
    // Ustawienie nagłówka WWW-Authenticate w przypadku braku autentykacji
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }
  // Dekodowanie danych autpryzacyjnych ( z base64)
  var auth = new Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");
  var user = auth[0];
  var pass = auth[1];
  // Sprawdzenie podanych danych pod kątem zawartości
  if (user == "" && pass == "") {
    // Jeśli użytkownik jest autoryzowany, przejdź do kolejnej funkji
    next();
  } else {
    // Jeśli nazwa użytkownika oraz hasło nie są puste, utworzenie błędu autentykacji
    var err = new Error("You are not authenticated!");
    // Ustawienie nagłówka WWW-Authenticate w przypadku braku autentykacji
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }
}

// Pierwszy krok to autentykacja klienta
app.use(authentication);
// Udostępnienie plików statycznych z folderu "public"
app.use(express.static(path.join(__dirname, "public")));

// Wystartowanie serwera na porcie 3000
app.listen(3000, () => {
  console.log("Server is Running");
});
