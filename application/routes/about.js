//routes for all the about team pages
// Author(s): Eunice, Emily, David, Andy, Melisa
var express = require('express');
var router = express.Router();
var hbs = require('hbs');


/* GET about page */
router.get('/', function(req, res, next) {
  res.render('about-hbs/about', { 
    title: 'About',
    members: [
      {
        membername: "Andy",
        roleDetails: "The Team Lead.  \
        Manages team 07 and responsibiites.",
        id: "andy"
      },
      {
        membername: "Juan David",
        roleDetails: "The Github Master.  \
        Has push privileges to main branch.",
        id: "juandavid"
      },
      {
        membername: "Emily",
        roleDetails: "The Front-End Lead. \
        Has push privileges to develop branch.",
        id: "emily"
      },
      {
        membername: "Eunice",
        roleDetails: "The Back-End Lead. Has push privileges to main & develop branch.",
        id: "eunice"
      },
      {
        membername: "Melisa",
        roleDetails: "QA/Documentation Lead.\
        Responsible for multiple tasks.",
        id: "melisa"
      }
    ]
      
  
    

  });
})

router.get('/andy', function(req, res, next) {
  res.render('about-hbs/andy', {
    title: 'Andy',
    membername: "Andy Almeida",
    memberImage:"/images/andy-photo.jpg",
    role: "Team Lead",
    linkedin: "https://www.linkedin.com/in/andy-almeida-9b17a0225/",
    github: "https://github.com/pie240",
    aboutMeContent: "Hi I'm Andy Almeida. I'm an undergraduate student at San Francisco State Univeristy majoring in \
    Computer Science. I'm a skateboarder from Southern California. My family both originated from latin countries, with my mom coming from Argentina, and my dad coming from Peru.\
    I like to play videogames, travel to different skateparks, and cook.",
    experience: "I have a bit of experience in application design and construction, mainly derived from class projects. \
    I have experience in working with a team from the many jobs and extracurriculars I have involved myself in over\
    my life. From playing waterpolo, to working as a shift lead at Nekter juicer, I have worked with many different\
    kinds of people in a myriad of group settings. I am eager to work with my team to build a strong product.\
    I project that this will be one of the biggest projects I have taken part in, and I am excited to see the \
    overall outcome. I think I will learn a lot from this experience, and Ill have something to show for it\
    by the end of this semester!",
    email1: "mailto:andyalmeida191@gmail.com",
    email2: "mailto:aalmeida1@mail.sfsu.edu"
});
});

router.get('/emily', function(req, res, next) {
  res.render('about-hbs/emily', {
    title: 'Emily',
    membername: "Emily Huang",
    memberImage: "/images/emily-photo.jpg",
    role: "Front-End Lead",
    linkedin: "https://www.linkedin.com/in/emily-huang-71109a238/",
    github: "https://github.com/emhuang3",
    aboutMeContent:"Hi I'm Emily Huang. I'm an undergraduate student at San Francisco State Univeristy majoring in \
    Computer Science. I'm a local San Franciscan who gets lost easily so please don\'t ask me for directions.",
    experience: "I don't have much experience with design beyond class projects, but I hope to do well as a front \
    end lead. I have experience in leadership as a former vice president of Girls Who Code in Highschool\
    which I hope will benefit me in this role. I also had experience volunteering from my Red Cross club \
    in Highschool so I hope my willingness to help won't stop my teammates from reaching out even if our\
    roles require different things.",
    email1: "mailto:emilyhuangx2012@gmail.com",
    email2: "mailto:ehuang10@mail.sfsu.edu"

  });
});

router.get('/eunice', function(req, res, next) {
  res.render('about-hbs/eunice', {
    title: 'Eunice',
    membername: "Eunice Borres",
    memberImage: "/images/eunice-photo.jpg",
    role: "Back-End Lead",
    linkedin: "https://www.linkedin.com/in/eunice-borres-297990159",
    github: "https://github.com/eunmdb",
    aboutMeContent:"Hi, my name is Eunice Borres and I am currently a senior at San Francisco State University. \
    I'm fairly new to backend programming and I will try my best to get better at it while\
    working on this project.",
    experience: "Some CS experiences I have includes Java, C++, Python, HTML, CSS, Javascipt, PHP and MySQL.",
    email1: "mailto:euborres@gmail.com",
    email2: "mailto:eborres@sfsu.edu"
  });
});

router.get('/juandavid', function(req, res, next) {
  res.render('about-hbs/juandavid', {
    title: 'Juan David',
    membername: "Juan David Liang",
    memberImage: "/images/juandavid-photo.jpg",
    role: "Github Master",
    linkedin: "https://www.linkedin.com/in/juan-david-guan-yu-liang-liao-ab13a721a/",
    github: "https://github.com/JDLiang100",
    aboutMeContent:"Hi I am Juan David Liang. I am a senior at San Francisco State University, this is probably my last semester. \
    I enjoy playing video games and badminton",
    experience: "I did a summer project with a Microsoft mentor where my team and I made a fullstack web app that allows users to look for roomates.\
    Other than that, I don't really have much Experience.",
    email1: "mailto:juandavidliang20@gmail.com",
    email2: "mailto:jliangliao@sfsu.edu"
  });
});

router.get('/melisa', function(req, res, next) {
  res.render('about-hbs/melisa', {
    title: 'Melisa',
    membername: "Melisa Sever",
    memberImage: "/images/melisa-photo.jpg",
    role: "Quality Assurance/Documentations",
    linkedin: "https://www.linkedin.com/in/melisa-sever-5b69b3202/",
    github: "https://github.com/melisa48",
    aboutMeContent:"Hello I'm Melisa Sever. I'm an undergraduate student at San Francisco State Univeristy majoring in \
    Computer Science. This semester is my last semester. I will be graduating.",
    experience: "I have never had much experience with design beyond class projects,but I hope to do well in quality assurance.\
    This is my first time being quality assurance. I was part of the De Anza Women In Computer Science club, \
    which I hope will benefit me in learning about computer science. I also had experience volunteering at Mountain View Key Club in Highschool, \
    so I hope my willingness to help won't stop my teammates from reaching out even if our roles require different things.",
    email1: "mailto:melisasever2000@gmail.com",
    email2: "mailto:bsever@sfsu.edu"
  });
});

module.exports = router;