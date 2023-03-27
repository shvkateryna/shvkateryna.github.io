from flask import Flask, request
from flask_mongoengine import MongoEngine
import json
from flask_cors import CORS, cross_origin
from cryptography.fernet import Fernet, InvalidToken

key = "Z6IIrLq-hAWCNUtSIvbOfeZ9LmPKy8QNFgpPFENyJ2U="
f = Fernet(key)

a = f.encrypt(b"641c60f4f48a2ec50e91ee09")
print(a)
print(f.decrypt(a).decode())

# Creating app
app = Flask(__name__)
cors = CORS(app)
app.config['MONGODB_SETTINGS'] = {
    'host':'mongodb+srv://nick:AFwhXGFyNZUtWvkY@cluster0.rg450ga.mongodb.net/database?retryWrites=true&w=majority'
}
app.config['CORS_HEADERS'] = 'Content-Type'
db = MongoEngine(app)

class Furniture(db.Document):
    type = db.StringField()
    type_expanded = db.StringField()
    images = db.StringField()
    # user fields

    priority = db.IntField()
    owner = db.StringField()
    description = db.StringField()
    questions = db.StringField()

    def to_json(self):
        return json.dumps({
            "type":self.type,
            "type_expanded":self.type_expanded,
            "images":self.images,
            "owner":self.owner,
            "description":self.description,
            "questions":self.questions
        }, indent=5)
    
class Room(db.Document):

    verified = db.BooleanField()
    number = db.IntField()
    names = db.ListField(db.StringField())
    furniture_list = db.ListField(db.ListField(db.ReferenceField(Furniture)))

    def to_json(self):
        print(self.furniture_list)
        new_list = []
        for list_furniture in self.furniture_list:
            small_list = []
            for furniture in list_furniture:
                small_list.append(json.loads(furniture.to_json()))
            new_list.append(small_list)

            # [json.loads(furniture.to_json())]
        return {
            "number":self.number,
            "names":self.names,
            "furniture_list":new_list,
            "verified": self.verified
        }

    def update_json(self, json_obj):

        self.number = json_obj["number"]
        self.names = json_obj["names"]

        for furniture_lists in zip(self.furniture_list,json_obj["furniture_list"]):
            for furniture in zip(furniture_lists[0], furniture_lists[1]):
                furniture[0].description = furniture[1]["description"]
                furniture[0].owner = furniture[1]["owner"]
                furniture[0].images = furniture[1]["images"]
                furniture[0].save()

    def verify(self):
        self.verified = True

class User(db.Document):

    rooms = db.ListField(db.ReferenceField(Room, dbref = False))
    uid = db.StringField()
    user_type = db.StringField()
    email = db.StringField()

    def to_json(self, full_info):
        if full_info:
            return ({

                "rooms": [json.loads(room.to_json()) for room in self.rooms],
                "uid":self.uid,
                "user_type":self.user_type,
                "email":self.email
            })
        else:
            return ({

                "rooms": [room.number for room in self.rooms],
                "user_type":self.user_type,
                "email":self.email
            })

@app.route("/create_admin")
def create_admin():
    user_admin = User(user_type = "ADMIN", uid = "ZN9kWTtfexdxQTb0CsumNdl91NL2", name = "admin")
    user_admin.save()

@app.route("/create_user", methods = ["POST"])
def create_user_endpoint():
    data = json.loads(request.data.decode("utf-8"))
    rooms = [wing.split("-") for wing in data["rooms"].split(",")][:-1]
    print(rooms)
    rooms_user = []
    for sets in rooms:
        for room_number in range(int(sets[0]), int(sets[1]) + 1):
            rooms_user += [Room.objects(number = room_number).first()]

    print(data)
    new_user = User(uid = data["uid"], email = data["email"] , user_type = data["role"] , rooms = rooms_user)
    new_user.save()
    return "user_created"

@app.route("/login", methods = ["POST"])
@cross_origin()
def login():
    data = json.loads(request.data.decode("utf-8"))
    user = User.objects(uid = data["uid"]).first()
    if not user:
        return "No login"
    return user.user_type
    # user_rooms = User.objects(uid = data.uuid).first().rooms
    # return user_rooms

@app.route("/curators")
@cross_origin()
def curators():
    users = User.objects()
    jsoned = [user.to_json(False) for user in users]
    return jsoned

@app.route("/curator_rooms/<id>")
@cross_origin()
def get_rooms(id):
    user = User.objects(uid = id).first()
    rooms = [room.to_json() for room in user.rooms]
    return rooms


@app.route("/add")
@cross_origin()
def hello():
    for floor in range(2, 6):    
        for number_room in range(floor*100 + 1, floor*100 + 35):
            
            furniture1_1 = Furniture(type= "door", type_expanded = "Вхідні двері", questions = "Розпочнімо з входу! Детально огляньте двері та стіни навколо них, якщо під час огляду ви виявили плями, подряпини, потертості, то обов’язково сфотографуйте й прикріпіть нижче.",priority = 1)
            furniture1_1.save()
            furniture1_2 = Furniture(type= "basebord",type_expanded = "Плінтус", questions = "Також огляньте плінтуси, якщо вони пошкоджені – сфотографуйте й вкажіть на недоліки.", priority = 2)
            furniture1_2.save()
            furniture1_3 = Furniture(type= "wadrobe",type_expanded = "Шафа", questions = "Перейдемо до шафи, що знаходиться біля вхідних дверей, загляньте у шафки та за наявності пошкоджень прикріпіть фото нижче.", priority = 3)
            furniture1_3.save()
            furniture1_4 = Furniture(type= "fridge", type_expanded = "Холодильник", questions = "Перейдіть до холодильника, відсуньте його, огляньте його ззовні та всередині, перегляньте полички, а також уважно подивіться на тумбу над холодильником.", priority = 4)
            furniture1_4.save()
            furniture1_5 = Furniture(type= "wall", type_expanded = "Стіни", questions = "Огляньте стіни навколо холодильника, за наявності плям, потертостей зробіть фото й прикріпіть.", priority = 5)
            furniture1_5.save()

    #main directory

            furniture2_1_1 = Furniture(type= "bed", type_expanded = "Одноповерхове ліжко", questions = "Огляньте одноповерхове ліжко, підійміть матраци та огляньте їх, перевірте чи наявні плями, зазначте недоліки. Огляньте наматрасники.", priority = 6)
            furniture2_1_2 = Furniture(type= "bed", type_expanded = "Двоповерхове ліжко, 1 поверх", questions = "Огляньте двоповерхове ліжко, 1 поверх, підійміть матраци та огляньте їх, перевірте чи наявні плями, зазначте недоліки. Огляньте наматрасники.", priority = 7)
            furniture2_1_3 = Furniture(type= "bed", type_expanded = "Двоповерхове ліжко, 2 поверх", questions = "Огляньте двоповерхове ліжко, 2 поверх, підійміть матраци та огляньте їх, перевірте чи наявні плями, зазначте недоліки. Огляньте наматрасники.", priority = 8)

            furniture2_1_1.save()
            furniture2_1_2.save()
            furniture2_1_3.save()

            # furniture2_2 = Furniture(type= "main",type_expanded = "matras protectors", questions = "Огляньте наматрасники.", priority = 7)
            
            # furniture2_2.save()
            furniture2_3 = Furniture(type= "shelf",type_expanded = "Шухляди під ліжками", questions = "Перейдіть до шухляд, які знаходяться під ліжками, висуньте їх повністю, передивіться уважно.", priority = 8)
            furniture2_3.save()
            furniture2_4 = Furniture(type= "wardrobe_bed", type_expanded = "Шафи біля ліжка", questions = "Огляньте шафи, які знаходяться біля ліжка, детально подивіться на кожну поличку, перевірте чи наявні потертості, нерівності, плями тощо.", priority = 9)
            furniture2_4.save()
            furniture2_5 = Furniture(type= "windowsill", type_expanded = "Підвіконня", questions = "Огляньте підвіконня, також перевірте ролети на наявність плям, або несправностей.", priority = 10)
            furniture2_5.save()
            furniture2_6 = Furniture(type= "table",type_expanded = "Столи та шухляди", questions = "Огляньте столи та усі шухляди, чи справні вони, чи наявні нерівності, потертості тощо.", priority = 11)
            furniture2_6.save()
            furniture2_7 = Furniture(type= "lamps",type_expanded = "Лампи", questions = "Перевірте лампи на столі, чи справні вони, чи наявні на них подряпини.", priority = 12)
            furniture2_7.save()
            furniture2_8 = Furniture(type= "chairs", type_expanded = "Стільці", questions = "Огляньте стільці, зазначте наявні дефекти.", priority = 13)
            furniture2_8.save()
            furniture2_9 = Furniture(type= "wardrobe_clothes", type_expanded = "Шафа для одягу", questions = "Перевірте шафу для одягу, огляньте усі полички, відкрийте нижні шухляди, зазначте несправності.", priority = 14)
            furniture2_9.save()
            furniture2_10 = Furniture(type= "wall", type_expanded = "Стіни", questions = "Також огляньте стіни навколо ліжок й шафи.", priority = 15)
            furniture2_10.save()

    #bathroom

            furniture3_1 = Furniture(type= "bathroom", type_expanded = "Двері до санвузла", questions = "Перейдіть до санвузла. Огляньте двері, та стіни біля них.", priority = 16)
            furniture3_1.save()
            furniture3_2 = Furniture(type= "bathroom", type_expanded = "Умивальник", questions = "Уважно огляньте умивальник, чи наявні тріщини, огляньте його знизу. Перегляньте змішувач.", priority = 17)
            furniture3_2.save()
            furniture3_3 = Furniture(type= "bathroom", type_expanded = "Дзеркало", questions = "Відчиніть шафку з дзеркалом, перегляньте її та дзеркало.", priority = 18)
            furniture3_3.save()
            furniture3_4 = Furniture(type= "bathroom", type_expanded = "Ванна (душова кабінка)", questions = "Огляньте душову кабінку (або ванну), шланг, мильничку. Зверніть увагу на розпилювач, перевірте його справність.", priority = 19)
            furniture3_4.save()
            furniture3_5 = Furniture(type= "bathroom", type_expanded = "Радіатор", questions = "Огляньте ще одну шафку, радіатор.", priority = 20)
            furniture3_5.save()
            furniture3_6 = Furniture(type= "bathroom", type_expanded = "Смітник", questions = "Перегляньте смітник, чи справний він, чи є пошкодження.", priority = 21)
            furniture3_6.save()
            furniture3_7 = Furniture(type= "bathroom", type_expanded = "Туалет", questions = "Огляньте туалет, йоршик, та паперотримач. ", priority = 22)
            furniture3_7.save()

            room1 = Room(verified = False, names=["", "", ""], number = number_room, furniture_list = [[furniture1_1, furniture1_2,furniture1_3, furniture1_4, furniture1_5], [furniture2_1_1,furniture2_1_2,furniture2_1_3, furniture2_3, furniture2_4, furniture2_5, furniture2_6, furniture2_7, furniture2_8, furniture2_9, furniture2_10], [furniture3_1, furniture3_2, furniture3_3, furniture3_4, furniture3_5, furniture3_6, furniture3_7]])
            room1.save()

    return "rooms created"



# @app.route("/rooms")
# @cross_origin()
# def rooms():
#     posted_data = request.form
#     user = User.objects(id = "63f5f662a1a1ad28c507fef0").first()
#     print(user.to_json())
#     return dict(user.to_json())



@app.route("/room/<encoded>/submit", methods = ["POST"])
@cross_origin()
def add_room_info(encoded):

    data = request.data.decode("utf-8")
    json4ik = json.loads(data, strict=False)
    room_id = f.decrypt(encoded).decode()
    room = Room.objects(id = room_id).first()
    room.update_json(json4ik)
    room.save()
    return "add"

@app.route("/verify", methods = ["POST"])
@cross_origin()
def verify():
    data = json.loads(request.data.decode("utf-8"))
    user_id = data["u_id"]
    user = User.objects(uid = user_id).first()
    print(data)
    if user.user_type == "USER" or user.user_type == "ADMIN":
        print(data, "+++")
        room_number = data["room_n"]
        for room in user.rooms:
            if room.number == room_number:
                room = Room.objects(number = room_number).first()
                room.verify()
                room.save()
                return "Verified"
        return "Not room"
    return "Not allowed"
    # room_id = f.decrypt(data.room_id).decode()


@app.route("/furniture")
@cross_origin()
def furniture():
    # room_id = Fernet.decrypt(encoded, key).decode()
    room = Furniture.objects(id = "63f7d72f4cf0331b497f3e7d").first()
    return room.to_json()

@app.route("/room/<encoded>")
@cross_origin()
def room_form(encoded):
    try:
        room_id = f.decrypt(encoded).decode()
        room = Room.objects(id = room_id).first()
        if not room:
            raise InvalidToken
    except InvalidToken:
        return "Wrong code",400
    room = Room.objects(id = room_id).first()

    if room.verified == False:
        return room.to_json()
    return "Already verifyed", 400

# Starting app
if __name__=="main":
    app.run()
