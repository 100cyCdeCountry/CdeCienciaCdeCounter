const gapiKey = "AIzaSyBJLpLCYlGEjzvE4nhXnCH9MeG24WW9Vfk";
const channelId = "UC52hytXteCKmuOzMViTK8_w";
const updateInterval = 60000;

function getSubSParameter(){
    let url = new URL(window.location.href);
    return parseInt(url.searchParams.get("subs"));
}

let subsPrediction = getSubSParameter();

const subsStart = {
    subs: 946772,
    date: new Date(2018, 9, 20).getTime()
};

function nextMillion(subs) {
    return subs - (subs % 1000000) + 1000000;
}

function calculateMillionDate(subStart, subNow, subToReach) {
    if(subToReach === undefined)
        subToReach = nextMillion(subNow.subs);
    return new Date((subToReach - subStart.subs)/(subNow.subs - subStart.subs)
        * (subNow.date - subStart.date) + subStart.date);
}

function showSubsStats(subs) {
    let amountDom = document.getElementById("subsAmount");
    let dateDom = document.getElementById("millonDate");

    if(isNaN(subsPrediction))
        subsPrediction = nextMillion(subs);

    if(subsPrediction % 1000000 === 0)
        subsPredictionAmount.innerText = subsPrediction / 1000000 + 'M';
    else
        subsPredictionAmount.innerText = subsPrediction.toLocaleString();

    amountDom.textContent = subs.toLocaleString();
    let millionDate = calculateMillionDate(subsStart, {subs: subs, date: new Date().getTime()}, subsPrediction);
    dateDom.textContent =
        millionDate.getDate() + "/" + (millionDate.getMonth() + 1) + "/" + millionDate.getFullYear();

    if(window.subs < subs) {
        amountDom.parentElement.classList.add("newSubs");
        setTimeout(function(){
            amountDom.parentElement.classList.remove("newSubs");
        }, 1000);
    }

    window.subs = subs;
}

function start() {
    // 2. Initialize the JavaScript client library.
    let client =  gapi.client.init({
        'apiKey': gapiKey,
    });

    let querySubs = function() {
        return client.then(function() {
            // 3. Initialize and make the API request.
            return gapi.client.request({
                'path': 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + channelId
                + '&fields=items%2Fstatistics%2FsubscriberCount&',
            })
        });
    };

    let parseQuery = function(response) {
        return parseInt(response.result.items[0].statistics.subscriberCount);
    };

    querySubs().then(function(response) {
        showSubsStats(parseQuery(response));

        setInterval(function() {
            querySubs().then(function(response){
                showSubsStats(parseQuery(response));
            });
        }, updateInterval);
    }, function(reason) {
        alert("No se ha podido recuperar los subs de CdeCiencia :(");
        console.error({error: "Gapi on query subs", data: reason})
    });


};
// 1. Load the JavaScript client library.
gapi.load('client', start);

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('jeffry', 'assets/jeffry.png');
    this.load.image('crespo', 'assets/crespo.png');
    this.load.image('lechugismo', 'assets/lechugismo.png');
    this.load.image('marti', 'assets/marti.png');
    this.load.image('rocket', 'assets/rocket.png');
    this.load.image('star', 'assets/particle.png');
    this.load.image('fire', 'assets/fire.png');
    this.load.image('earth', 'assets/earth.png');
    this.load.image('panconjamon', 'assets/pan con jamon.png');
    this.load.image('robot', 'assets/robot.png');
    this.load.image('love', 'assets/love.png');
}

//Ok, this is a mess :S
function create ()
{
    var scaleFactor = 1;

    var jeffry = this.add.image(config.width, Phaser.Math.Between(0, 2/3 * config.height), 'jeffry');
    jeffry.setScale(0.4);
    jeffry.x += jeffry.displayWidth;
    var crespo = this.add.image(config.width, Phaser.Math.Between(0, 2/3 *config.height), 'crespo');
    crespo.setScale(0.4);
    crespo.x += crespo.displayWidth * 2;
    var lechugismo = this.add.image(config.width, Phaser.Math.Between(0, 2/3 *config.height), 'lechugismo');
    lechugismo.setScale(0.4);
    lechugismo.x += lechugismo.displayWidth;
    var panconjamon = this.add.image(config.width, Phaser.Math.Between(0, 2/3 *config.height), 'panconjamon');
    panconjamon.setScale(0.4);
    panconjamon.x += panconjamon.displayWidth;
    var robot = this.add.image(config.width, Phaser.Math.Between(0, 2/3 *config.height), 'robot');
    robot.setScale(0.2);
    robot.x += robot.displayWidth;
    var earth = this.add.image(config.width, Phaser.Math.Between(0, 2/3 *config.height), 'earth');
    earth.setScale(0.7);
    earth.x += earth.displayWidth;

    var marti = this.add.image(0, 0, 'marti');
    this.rocket = this.add.image(0, 0, 'rocket');

    //jeffry.scaleX = jeffry.scaleX = 0.4;

    this.tweens.add({
        targets: [ jeffry, crespo, earth, robot, lechugismo, panconjamon ],
        props: {
            x: { value: function(target) {
                    return -target.displayWidth;
                } },
            y: { value: '+=' + config.width * Math.sin(10 * Math.PI / 180) },
            angle: { value: 360 }
        },
        duration: 3500,
        ease: 'Linear',
        repeat: -1,

        delay: function (i, total, target) {
            return i % total * 3500;
        },
        repeatDelay: 3500 * 5 - 200
    });

    if(this.rocket.width > window.innerWidth) {
        this.rocket.displayWidth = window.innerWidth * 0.8;
        scaleFactor = this.rocket.scaleX;
        this.rocket.scaleY = scaleFactor;
    }

    marti.x = this.rocket.width * .1 * scaleFactor;
    marti.y = -this.rocket.height * .3 * scaleFactor;
    marti.scaleX = marti.scaleY = scaleFactor * .07;

    this.rocketFlame = this.add.image(0, 0, 'star');
    this.rocketFlame.x = -this.rocket.width * 0.4 * scaleFactor;

    var particleStar = this.add.particles('star');
    var particleFire = this.add.particles('fire');
    var particleHeart = this.add.particles('love');

    var stars = particleStar.createEmitter({
        x: config.width,
        y: { min: -config.width * 0.1, max: config.height },
        scale: { max: 0.5, min: 0.3 },
        blendMode: 'ADD',
        angle: 170,
        speed: { min: 100, max: 200 },
        lifespan: { min: 10000, max: 40000 },
        frequency: 100,
        alpha: { start: 1, end: 0 },
    });

    this.fire = particleFire.createEmitter({
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        angle: 170,
        speed: 200,
        lifespan: 10000,
        frequency: 50,
        alpha: { start: 1, end: 0 },
        scale: { min: 0.1 * scaleFactor, max: 0.3 * scaleFactor },
    });

    this.spaceship = this.add.container(config.width / 2, config.height / 2, [ marti, this.rocket, this.rocketFlame ]);
    this.spaceship.setDepth(1);
    this.spaceship.angle = 5;

    this.tweens.add({
        targets: this.spaceship,
        angle: -10,
        y: this.spaceship.y - config.height * 0.1,
        x: this.spaceship.x - config.width * 0.05,
        duration: 3000,
        ease: 'Cubic.easeInOut',
        loop: -1,
        yoyo: true,
    });

    this.tweens.timeline({
        targets: marti,
        ease: 'Linear',
        flipX: true,
        yoyo: true,
        duration: 2000,
        loop: -1,

        tweens: [
            {
                y: marti.y,
            },
            {
                y:  marti.y + 0.2 * marti.displayHeight,
                flipX: true,
            },
            {
                y: marti.y,

            },
            {
                y:  marti.y + 0.1 *  marti.displayHeight,
            },
            {
                flipX: false,
                y: marti.y,
            }
            ]

    });

    //fire.startFollow(this.rocketFlame, this.spaceship.x, this.spaceship.y);
    //fire.startFollow(this.spaceship, this.rocketFlame.x, this.rocketFlame.displayHeight / 2);


    var love = particleHeart.createEmitter({
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        lifespan: 500,
        frequency: 250,
        speed: 100,
        alpha: { start: 1, end: 0 },
        scale: { min: 0.05, max: 0.1 },
    });

    love.startFollow(crespo);

    subsParticles = particleHeart.createEmitter({
        frame: [ 'love' ],
        angle: { min: 0, max: 360 },
        speed: { min: 200, max: 300 },
        quantity: 6,
        lifespan: 2000,
        alpha: { start: 1, end: 0 },
        scale: { start: 1.5, end: 0.5 },
        on: false
    });

    this.events.on('subsEvent', function() {
        subsParticles.emitParticleAt(0, 0);
    }, this);

}

function update() {
    let offset = this.rocketFlame.x;
    let sideX = Math.sin(this.spaceship.rotation) * offset;
    let sideY = Math.cos(this.spaceship.rotation) * offset;
    this.fire.setPosition(this.spaceship.x + sideY, this.spaceship.y + sideX + this.rocket.displayHeight * 0.1);
}
