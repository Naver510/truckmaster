# Truckmaster
System ewidencji pojazdów
System ewidencji pojazdów umożliwia centralne zarządzanie flotą: rejestrację pojazdów, rezerwacje na potrzeby użytkowników/pracowników, zwalnianie i usuwanie rekordów.Stworzony dla operatorów flot, działów logistycznych, pracowników firm z samochodami służbowymi. Celem jest ograniczenie konfliktów rezerwacji, mieć historię użycia i proste operacje administracyjne.

Podstawowe encje i pola
Vehicle (Pojazd)
id, regestration_number (nr_rej), make, model, year, mileage, status(dostępny/rezerwowany/serwis), location, notes

Reservation(Rezerwacja)
id, vehicle_id, user_id, start_datetime, end_datetime, purpose, status(aktywna/zrealizowana/anulowana)

User(Uzytkownik)
id, name, email, phone, role(user/admin)

Maintenance(Serwis)
id, vehicle_id, date, description, cost, performed_by

Listwa podstawowych funkcjonalności (CRUD)
Pojazdy(Vehicle)
Create: dodać nowy pojazd
Read: lista wszystkich pojazdów, filtr(status, marka, dostepność)
Update: edytować dane pojazdu(status, przebieg, lokalizacja)
Delete: usuwanie rezerwacji

Rezerwacje(Reservation)
Create: zarezerwować pojazd na czas
Read: podgląd rezerwacji
Update: modyfikacja czasu
Delete: usuwanie rezerwacji

Użytkownicy(User)
Create/Read/Update/Delete (role i uprawnienia: zwykły user i admin)

User stories / przypadki użycia
Jako pracownik chcę dodać nowy pojazd do systemu, aby mógł być rezerwowany.
Akceptacja: formularz z wymaganymi polami, po zapisie pojazd pojawia się na liście jako "dostępny".
Jako pracownik chcę przeglądać listę pojazdów z filtrami, aby szybko znaleźć dostępny samochód.
Akceptacja: filtry po statusie, marce, lokalizacji; widok szczegółów pojazdu.
Jako użytkownik chcę zarezerwować dostępny pojazd na określony przedział czasowy, aby zapewnić sobie auto.
Akceptacja: system sprawdza kolizje rezerwacji i blokuje rezerwacje nakładające się.
Jako użytkownik chcę anulować swoją rezerwację, jeśli plany się zmienią.
Akceptacja: rezerwacja przechodzi do statusu "anulowana", widoczna w historii.
Jako administrator chcę edytować dane pojazdu (np. status na serwis), aby odzwierciedlić rzeczywisty stan floty.
Akceptacja: zmiana statusu blokuje nowe rezerwacje jeśli status != dostępny.
Jako administrator chcę usuwać pojazdy, ale z opcją zachowania historii rezerwacji.
Akceptacja: usunięcie wymaga potwierdzenia; historia rezerwacji pozostaje lub jest anonimizowana.
Jako użytkownik chcę zobaczyć moje aktywne i przeszłe rezerwacje, aby śledzić historię użycia.
Akceptacja: lista filtrów (aktywne/przeszłe/anulowane).
Endpointy
Users
GET /users: lista uzytkowników
GET /users/id: pobierz uzytkownika
POST /users: utwórz użytkownika
PUT / users/id: zmodyfikuj dane uzytkownika


Zasób
Metoda
Endpoint
Opis
Users
GET
GET /users
Lista użytkowników
Users
GET
GET /users/:id
Pobierz użytkownika po id
Users
POST
POST /users
Utwórz nowego użytkownika
Users
PUT/PATCH
PUT /users/:id / PATCH /users/:id
Aktualizuj użytkownika
Users
DELETE
DELETE /users/:id
Usuń użytkownika
Vehicles
GET
GET /vehicles
Lista pojazdów (filtry: status, location)
Vehicles
GET
GET /vehicles/:id
Pobierz pojazd po id
Vehicles
POST
POST /vehicles
Dodaj pojazd
Vehicles
PUT/PATCH
PUT /vehicles/:id / PATCH /vehicles/:id
Aktualizuj pojazd (np. mileage, status)
Vehicles
DELETE
DELETE /vehicles/:id
Usuń pojazd
Vehicles
GET
GET /vehicles/:id/availability
Sprawdź dostępność (opcjonalnie)
Reservations
GET
GET /reservations
Lista rezerwacji (filtry: userId, vehicleId, status)
Reservations
GET
GET /reservations/:id
Pobierz rezerwację po id
Reservations
POST
POST /reservations
Utwórz rezerwację
Reservations
PUT/PATCH
PUT /reservations/:id / PATCH /reservations/:id
Aktualizuj rezerwację (daty, status)
Reservations
DELETE
DELETE /reservations/:id
Anuluj / usuń rezerwację
Reservations
POST
POST /reservations/:id/complete
Oznacz rezerwację jako zrealizowana (opcjonalnie)
Maintenance
GET
GET /maintenance
Lista wpisów serwisowych (filtry: vehicleId)
Maintenance
GET
GET /maintenance/:id
Pobierz wpis serwisowy
Maintenance
POST
POST /maintenance
Dodaj wpis serwisowy
Maintenance
PUT/PATCH
PUT /maintenance/:id / PATCH /maintenance/:id
Aktualizuj wpis serwisowy
Maintenance
DELETE
DELETE /maintenance/:id
Usuń wpis serwisowy




Technologie
Backend: 
Nestjs, Prisma, PostgreSQL
Frontend:
React + Vite
Figma
Tools:
Docker

Github: https://github.com/Naver510/truckmaster


