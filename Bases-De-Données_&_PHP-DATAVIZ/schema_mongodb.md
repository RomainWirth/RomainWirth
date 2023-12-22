```JSON
[{
    "actor": {
        "_id": {type: int, required: true},
        "lastname": {type: String, required: true},
        "firstname": {type: String, required: true},
        "birthdate": {type: date, required: true},
        "nationality": {type: String, required: true},
        "speciality": {type: [], required: true}
    }
},
{
    "film": {
        "_id": {type: int, required: true},
        "title": {type: String, required: true},
        "year": {type: date, required: true},
        "genre": {type: String, required: true},
        "budget": {type: int, required: true},
        "length": {type: int, required: true},
        "distribution": [
            {
                "actor_id": {type: int, required: true},
                "age": {type: int, required: true},
                "role": {type: String, required: true}
            }
        ]
    }
},
{
    "cinema": {
        "_id": {type: int, required: true},
        "name": {type: String, required: true},
        "address": {type: String, required: true},
        "city": {type: String, required: true},
        "tel": {type: String, required: true},
        "movie-room": [
            {
                "capacity": {type: int, required: true},
                "room-number": {type: int, required: true}
            }
        ]
    }
},
{
    "movie-show": {
        "_id": {type: int, required: true},
        "date": {type: date, required: true},
        "film_id": {type: int, required: true},
        "cinema": {
            "cinema_id": {type: int, required: true},
            "room-number": {type: int, required: true}
        }
    }
}]
```