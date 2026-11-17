/* Frases, cine, prueba de nivel y TOEFL */
window.PHRASES = [
 {cat:"Conocer gente", items:[["What do you do for a living?","¿A qué te dedicas?"],["How's it going?","¿Qué tal todo?"],["Long time no see!","¡Cuánto tiempo sin verte!"],["What have you been up to?","¿Qué has hecho últimamente?"],["Let's keep in touch.","Sigamos en contacto."],["It was great meeting you.","Fue un gusto conocerte."]]},
 {cat:"Viajes y aeropuerto", items:[["Where is the check-in desk?","¿Dónde está el mostrador de documentación?"],["I'd like a window seat, please.","Quisiera un asiento de ventana, por favor."],["Is this the right platform for Oxford?","¿Este es el andén correcto para Oxford?"],["I have a reservation under the name Bolaños.","Tengo una reservación a nombre de Bolaños."],["Could you recommend a place to eat nearby?","¿Podría recomendarme un lugar para comer cerca?"],["How do I get to the city centre?","¿Cómo llego al centro?"]]},
 {cat:"Restaurante", items:[["A table for two, please.","Una mesa para dos, por favor."],["What do you recommend?","¿Qué recomienda?"],["I'm allergic to nuts.","Soy alérgico a las nueces."],["Could we have the bill, please?","¿Nos trae la cuenta, por favor?"],["Can I pay by card?","¿Puedo pagar con tarjeta?"],["It was delicious, thank you.","Estuvo delicioso, gracias."]]},
 {cat:"Trabajo y reuniones", items:[["Let's get started.","Empecemos."],["Could you walk me through it?","¿Podrías explicármelo paso a paso?"],["I'll get back to you by Friday.","Te respondo antes del viernes."],["Let me share my screen.","Déjame compartir mi pantalla."],["I'm afraid I can't make it.","Me temo que no podré asistir."],["Let's circle back to that later.","Retomemos eso más tarde."]]},
 {cat:"Opinar y debatir", items:[["As far as I'm concerned…","En lo que a mí respecta…"],["I see your point, but…","Entiendo tu punto, pero…"],["I couldn't agree more.","No podría estar más de acuerdo."],["That's not how I see it.","Yo no lo veo así."],["It depends on how you look at it.","Depende de cómo lo veas."],["Let's agree to disagree.","Aceptemos que no coincidimos."]]},
 {cat:"Universidad", items:[["Could you repeat that, please?","¿Podría repetirlo, por favor?"],["When is the assignment due?","¿Cuándo se entrega la tarea?"],["I'd like to ask for an extension.","Quisiera pedir una prórroga."],["Could I borrow your notes?","¿Me prestas tus apuntes?"],["I'm majoring in engineering.","Estudio la carrera de ingeniería."],["What are your office hours?","¿Cuál es su horario de asesorías?"]]},
 {cat:"Emergencias y salud", items:[["I need a doctor.","Necesito un médico."],["I've lost my passport.","Perdí mi pasaporte."],["Where is the nearest pharmacy?","¿Dónde está la farmacia más cercana?"],["I don't feel well.","No me siento bien."],["Can you call an ambulance?","¿Puede llamar una ambulancia?"],["It hurts here.","Me duele aquí."]]}
];

/* Líneas breves de películas, usadas como ejemplo de gramática */
window.QUOTES = [
 {q:"May the Force be with you.", film:"Star Wars", year:1977, level:"B1", note:"<b>May + sujeto + verbo base</b> expresa un deseo formal, como <i>Que la Fuerza te acompañe</i>."},
 {q:"I'll be back.", film:"The Terminator", year:1984, level:"A2", note:"<b>will</b> para promesas. La contracción <i>I'll</i> suena natural; <i>I will</i> suena enfático."},
 {q:"Houston, we have a problem.", film:"Apollo 13", year:1995, level:"A1", note:"Presente simple con <b>have</b>. Hoy se usa en broma para anunciar cualquier contratiempo."},
 {q:"To infinity and beyond!", film:"Toy Story", year:1995, level:"A2", note:"<b>beyond</b> = más allá. Preposición muy útil: <i>beyond my control</i>."},
 {q:"Just keep swimming.", film:"Finding Nemo", year:2003, level:"A2", note:"<b>keep + -ing</b> = seguir haciendo algo. <i>Keep trying, keep going.</i>"},
 {q:"Why so serious?", film:"The Dark Knight", year:2008, level:"B1", note:"Elipsis coloquial: se omite <i>are you</i>. Completo sería <i>Why are you so serious?</i>"},
 {q:"There's no place like home.", film:"The Wizard of Oz", year:1939, level:"A1", note:"<b>There is no… like…</b> para decir que algo es incomparable."},
 {q:"You can't handle the truth!", film:"A Few Good Men", year:1992, level:"B1", note:"<b>handle</b> = manejar, soportar. <i>I can handle it</i> = yo me encargo."},
 {q:"I'm the king of the world!", film:"Titanic", year:1997, level:"A1", note:"Verbo <b>to be</b> + artículo <b>the</b> cuando solo hay uno: <i>the king, the sun, the best</i>."},
 {q:"Carpe diem. Seize the day.", film:"Dead Poets Society", year:1989, level:"B2", note:"<b>seize</b> = agarrar, aprovechar. Collocation: <i>seize the opportunity</i>."},
 {q:"With great power comes great responsibility.", film:"Spider-Man", year:2002, level:"C1", note:"<b>Fronting con inversión</b>: el complemento va primero y el verbo antes del sujeto."},
 {q:"Elementary, my dear Watson.", film:"The Adventures of Sherlock Holmes", year:1939, level:"B2", note:"<b>elementary</b> = básico, obvio. Frase hecha para decir que algo es evidente."}
];

window.FILMS = [
 {level:"A1", why:"Animación: diálogos lentos, claros y con mucho apoyo visual.", list:["Finding Nemo","Toy Story","Paddington"]},
 {level:"A2", why:"Historias familiares con vocabulario cotidiano y frases cortas.", list:["The Lion King","Up","Home Alone"]},
 {level:"B1", why:"Comedias y dramas con conversaciones reales a velocidad moderada.", list:["Forrest Gump","The Devil Wears Prada","The Truman Show"]},
 {level:"B2", why:"Tramas más complejas, humor y distintos acentos.", list:["The Social Network","Inception","Notting Hill"]},
 {level:"C1", why:"Diálogo denso, vocabulario profesional y discursos.", list:["The King's Speech","Dead Poets Society","Spotlight"]},
 {level:"C2", why:"Jerga, ironía, velocidad alta y referencias culturales.", list:["The Big Short","Oppenheimer","Twelve Angry Men"]}
];

window.PLACEMENT = [
 ["My name ___ Carla.",["am","is","are"],1],["She ___ in a bank.",["work","works","working"],1],["There ___ two chairs in the kitchen.",["is","are","be"],1],
 ["We ___ to Cancún last summer.",["go","went","gone"],1],["This exam is ___ than the last one.",["easier","more easy","easiest"],0],["Have you ever ___ to Canada?",["be","was","been"],2],
 ["I've lived here ___ 2018.",["for","since","from"],1],["If I ___ more money, I'd travel more.",["have","had","will have"],1],["The film ___ directed by a woman.",["was","did","has"],0],
 ["By the time I arrived, the class ___.",["started","has started","had started"],2],["He ___ have left already; his coat is gone.",["must","can't","should"],0],["I'm looking forward to ___ you.",["meet","meeting","met"],1],
 ["Hardly ___ sat down when the bell rang.",["I had","had I","I have"],1],["___ I need is some peace and quiet.",["That","What","Which"],1],["___ the report, she emailed it to the team.",["Finished","Having finished","Been finished"],1],
 ["It is essential that he ___ on time.",["is","be","will be"],1],["Tired ___ he was, he drove all night.",["though","despite","even"],0],["___ the weather, the event was a success.",["Notwithstanding","Albeit","Whereas"],0]
];

window.TOEFL = {
 format:[
  {s:"Reading", tasks:["Complete the Words","Read in Daily Life","Read an Academic Passage"], tip:"Adaptativo: el segundo bloque se ajusta a tu desempeño en el primero."},
  {s:"Listening", tasks:["Listen and Choose a Response","Listen to a Conversation","Listen to an Announcement","Listen to an Academic Talk"], tip:"Cada audio se escucha una sola vez. Adaptativo."},
  {s:"Writing", tasks:["Build a Sentence","Write an Email","Write for an Academic Discussion"], tip:"Textos breves y funcionales, con tiempo corto por tarea."},
  {s:"Speaking", tasks:["Listen and Repeat","Take an Interview"], tip:"Respuestas habladas cortas, sin tiempo de preparación largo."}
 ],
 scale:[["6","C2","Dominio"],["5 – 5.5","C1","Avanzado"],["4 – 4.5","B2","Intermedio alto"],["3 – 3.5","B1","Intermedio"],["2 – 2.5","A2","Básico"],["1 – 1.5","A1","Principiante"]],
 /* Complete the Words: [visible, oculto] por palabra incompleta; texto con marcadores {n} */
 ctw:{text:"Coral reefs are among the most diverse ecosystems on Earth. Although they cover less than one percent of the ocean {0}, they support roughly a quarter of all marine {1}. Corals are tiny animals that live in large {2} and build hard skeletons over thousands of {3}. They depend on microscopic algae, which provide them with {4} and give reefs their bright {5}. When the water becomes too {6}, corals expel the algae and turn white, a process {7} as bleaching.",
      gaps:[["flo","or"],["spe","cies"],["colo","nies"],["ye","ars"],["fo","od"],["colo","urs"],["wa","rm"],["kno","wn"]]},
 daily:{title:"Aviso en la biblioteca del campus", text:"NOTICE — Riverside Library\nFrom Monday, 3 March, the second floor will be closed for renovation. Group study rooms 2A–2F will be unavailable until further notice. Students with existing bookings will be moved to rooms on the fourth floor automatically and will receive a confirmation email. Printing services remain on the ground floor. The library will open one hour later than usual (9 a.m.) during the first week of the works.",
   q:[["What will happen to students who already booked a second-floor room?",["Their booking will be cancelled","They will be moved to the fourth floor","They must book again in person"],1,"<i>will be moved to rooms on the fourth floor automatically</i>."],
      ["What time will the library open during the first week?",["8 a.m.","9 a.m.","10 a.m."],1,"Abre una hora más tarde de lo usual: 9 a.m."]]},
 passage:{title:"The Invention of Standard Time", text:"Before the nineteenth century, towns kept their own local time, set by the position of the sun. Noon in one city could differ by several minutes from noon in a city only a short distance away. For most of history this caused little trouble, since travel was slow and the differences went unnoticed.\n\nThe expansion of railways changed everything. Trains crossed dozens of local times in a single day, and printed timetables became confusing and occasionally dangerous: two trains sharing one track might be running on clocks that disagreed. Railway companies responded by adopting a single time for their whole network, but different companies often chose different standards, so large stations sometimes displayed several clocks at once.\n\nIn 1884, delegates from twenty-five nations met in Washington and agreed on a prime meridian passing through Greenwich, England, as the reference for a worldwide system of time zones. Adoption was gradual, however. Some communities resisted, arguing that “railway time” was artificial and that the sun remained the only honest clock. Nevertheless, the practical benefits proved persuasive, and within a few decades standard time had become the norm.",
   q:[["Why did local time cause few problems before the nineteenth century?",["People had no clocks","Travel was slow, so differences went unnoticed","Governments regulated it strictly"],1,"Primer párrafo: <i>travel was slow and the differences went unnoticed</i>."],
      ["The word <b>persuasive</b> in the last paragraph is closest in meaning to:",["convincing","expensive","temporary"],0,"<i>persuasive</i> = convincente."],
      ["Why did some stations display several clocks?",["For decoration","Different companies used different time standards","Clocks were unreliable"],1,"Segundo párrafo."],
      ["What can be inferred about the 1884 agreement?",["It was adopted everywhere immediately","It faced some resistance before becoming normal","It was rejected by railway companies"],1,"<i>Adoption was gradual… Some communities resisted.</i>"]]},
 respond:[["Do you know when the lab closes today?",["At six, I think.","It's on the second floor.","Yes, I closed it."],0,"Pregunta por hora: se responde con una hora."],
          ["Would you mind if I opened the window?",["Yes, I'm closing.","Not at all, go ahead.","I don't have a window."],1,"<i>Would you mind…?</i> se acepta con <i>Not at all</i>."],
          ["How did your presentation go?",["By bus.","Better than I expected.","It goes tomorrow."],1,"Se pregunta por el resultado."]],
 conv:{title:"Conversación en la oficina de servicios escolares",
  lines:[[0,"Student","Hi, I'd like to drop my statistics course. Is it too late?"],[1,"Advisor","The deadline was last Friday, I'm afraid. After that you need your professor's signature on a late withdrawal form."],[0,"Student","I see. Would it affect my scholarship?"],[1,"Advisor","It might. You need at least twelve credits to keep it, and without statistics you'd have eleven."],[0,"Student","Then maybe I should switch to another course instead of dropping it."],[1,"Advisor","That's possible until Wednesday. There are still places in Introduction to Economics."]],
  q:[["What does the student need for a late withdrawal?",["A medical note","The professor's signature","A payment"],1,"<i>you need your professor's signature</i>."],
     ["Why might dropping the course be a problem?",["She would fall below twelve credits","The course is required","She would lose her room"],0,"Quedaría con once créditos."]]},
 announce:{title:"Anuncio en clase", text:"Before we finish, a quick reminder about the field trip to the geology museum. The bus leaves from the main gate at eight fifteen on Thursday, not Friday as it says on the syllabus. Please bring your student ID, because the museum offers free entry only to registered students. Lunch is not included, so pack something or bring money for the café. If you can't attend, email me by Tuesday and I'll give you an alternative assignment.",
  q:[["When does the bus leave?",["Thursday at 8:15","Friday at 8:15","Tuesday at 8:50"],0,"<i>eight fifteen on Thursday, not Friday</i>."],
     ["What should students who cannot attend do?",["Pay a fee","Email the professor by Tuesday","Go on Friday instead"],1,"<i>email me by Tuesday</i>."]]},
 talk:{title:"Charla académica: psicología", text:"Today I want to talk about a phenomenon called the spacing effect. Imagine two students preparing for the same exam. The first studies for five hours the night before. The second studies for one hour a day over five days. Both spend exactly the same amount of time. Yet, when tested a week later, the second student typically remembers far more. Why? Well, each time you return to material after a break, your brain has to work to retrieve it. That effort, which can feel uncomfortable, actually strengthens the memory. Cramming feels productive because the information is fresh, but that feeling is misleading. So my advice is simple: study less at once, but more often, and don't be discouraged when recalling feels hard. That difficulty is the learning.",
  q:[["What is the main idea of the talk?",["Studying longer is always better","Spreading study sessions over time improves memory","Exams should be given weekly"],1,"Define el <i>spacing effect</i>."],
     ["According to the professor, why does retrieval after a break help?",["It is effortless","The effort of recalling strengthens memory","It reduces study time"],1,"<i>That effort… strengthens the memory.</i>"],
     ["What does the professor say about cramming?",["It feels productive but that feeling is misleading","It is the best method before exams","It should be done every day"],0,"<i>that feeling is misleading</i>."]]},
 build:[{es:"¿Sabes dónde está la oficina del profesor?", a:"Do you know where the professor's office is"},
        {es:"Nunca había visto una presentación tan clara.", a:"I had never seen such a clear presentation"},
        {es:"¿Te importaría enviarme las notas de la clase?", a:"Would you mind sending me the class notes"},
        {es:"El informe debe entregarse antes del viernes.", a:"The report must be submitted before Friday"}],
 email:{prompt:"Compraste una laptop en línea para tus clases y llegó con la pantalla dañada. Escribe un correo al servicio al cliente. Explica el problema, di qué solución quieres y menciona por qué es urgente.",
  checklist:["Saludo y motivo en la primera línea","Qué pasó, con número de pedido o fecha","Qué solución pides (reemplazo o reembolso)","Por qué es urgente","Cierre cortés"],
  model:"Dear Customer Service Team,\n\nI am writing about order 48213, a laptop that was delivered on Monday. When I opened the box, I found that the screen was cracked in the lower left corner, so the device cannot be used.\n\nI would like to request a replacement as soon as possible. My university courses begin next week and I need the laptop for my assignments. If a replacement is not available within five days, I would prefer a full refund.\n\nI have attached photos of the damage. Please let me know how to return the item.\n\nKind regards,\nAlex Rivera"},
 discuss:{prof:"Professor Lin: This week we are discussing remote work. Some companies now let employees work from home permanently. Do you think this benefits society overall? Why or why not?",
  posts:[["Maya","I think it helps. People save hours of commuting, which reduces pollution and gives families more time together."],["Omar","I disagree. Young employees learn by watching experienced colleagues, and that is much harder through a screen."]],
  model:"I agree with Maya that remote work benefits society, although Omar raises a fair concern. Beyond reducing commuting, working from home allows people to live outside expensive cities, which can revive smaller towns and lower housing pressure in large ones. As for training, companies can pair new employees with mentors and hold regular in-person weeks, so learning does not have to suffer. In my view, a flexible model that keeps the office optional offers the greatest benefit to the largest number of people."},
 repeat:["The library closes at nine tonight.","Please hand in your assignment before Friday.","The lecture has been moved to room two hundred and four.","Students who register early will receive a discount on the course fee.","If you need help with your research, the writing centre is open every afternoon."],
 interview:["Tell me about a place where you like to study and why it works for you.","Do you prefer working alone or in a group? Give an example.","Describe a skill you would like to learn in the next year.","Some people think universities should require all students to learn a second language. What is your opinion?"],
 strategies:[
  ["Reading","En <i>Complete the Words</i> lee toda la oración antes de escribir: el contexto te da la categoría gramatical. En el pasaje académico, localiza primero la pregunta y después busca la evidencia en el párrafo."],
  ["Listening","Solo hay una reproducción. Anota nombres, cifras, fechas y cambios de opinión. Las correcciones (<i>not Friday, Thursday</i>) casi siempre se preguntan."],
  ["Writing","En el correo cubre los tres puntos del enunciado, uno por párrafo. En la discusión, toma postura en la primera oración, menciona a un compañero y aporta una idea nueva."],
  ["Speaking","En <i>Listen and Repeat</i> importa la exactitud: agrupa la oración en bloques de sentido. En la entrevista responde, da una razón y un ejemplo; no memorices respuestas."]
 ],
 plan:[["Semana 1","Diagnóstico con la prueba de nivel y un simulacro. Repasa la gramática de B2. 20 palabras académicas al día."],["Semana 2","Reading y Listening: dos textos y dos audios diarios, revisando cada error."],["Semana 3","Writing y Speaking: un correo y una discusión al día; grábate en la entrevista y escucha tus muletillas."],["Semana 4","Simulacros completos con cronómetro, repaso de errores y descanso el día previo."]]
};

/* Videos de YouTube. Se reproducen dentro de la página cuando el sitio lo permite; si no, abren en YouTube. */
window.VIDEOS = [
 {id:"DjShiTl2hlo", level:"a1", kind:"Clase", t:"Basic Greetings and Introductions", task:"Pausa después de cada saludo y repítelo en voz alta. Anota tres que no conocías."},
 {id:"PoqgDtIsZ8o", level:"a2", kind:"Conversación", t:"English Conversation for Beginners", task:"Distingue los saludos formales de los informales y escribe uno de cada tipo."},
 {id:"WDJlTaihMsY", level:"b1", kind:"Curso de la BBC", t:"BBC Learning English: curso intermedio, unidad 1", task:"Velo una vez sin subtítulos y otra con subtítulos en inglés. Resume de qué trata en tres oraciones."},
 {id:"j9b1CNN_rFU", level:"b1", kind:"Gramática de la BBC", t:"Asking Questions, 6 Minute Grammar", task:"Escribe cinco preguntas tuyas con las estructuras que explican."},
 {id:"MMmOLN5zBLY", level:"b2", kind:"TED-Ed", t:"The benefits of a bilingual brain", task:"Anota los tipos de bilingüismo que menciona y explica en inglés cuál es el tuyo."},
 {id:"eIho2S0ZahI", level:"c1", kind:"Charla TED", t:"How to speak so that people want to listen", task:"Haz en voz alta los ejercicios de voz que propone y aplica uno al grabar tu respuesta de speaking."},
 {id:"YEaSxhcns7Y", level:"c2", kind:"TED-Ed", t:"Where did English come from?", task:"Explica en un minuto, sin notas, por qué el inglés mezcla vocabulario germánico y latino."},
 {id:"fcN0BXzK8bg", level:"c2", kind:"Podcast de la BBC", t:"6 Minute English: All About Language", task:"Elige un episodio, anota su vocabulario y úsalo en un párrafo de opinión."},
 {id:"Ap8GfXXJCNM", level:"cine", kind:"Tráiler", t:"Paddington in Peru", task:"Nivel A2. Escribe quiénes aparecen y a dónde van."},
 {id:"wOhH7gn54BM", level:"cine", kind:"Tráiler", t:"Forrest Gump", task:"Nivel B1. Apunta dos frases que entiendas completas y repítelas con la misma entonación."},
 {id:"YoHD9XEInc0", level:"cine", kind:"Tráiler", t:"Inception", task:"Nivel B2. Explica la premisa de la película en tres oraciones usando el presente simple."},
 {id:"vdahkGSG5tU", level:"toefl", kind:"Explicación", t:"New TOEFL Exam Explained", task:"Compara lo que explica con la tabla de formato y anota tus dudas."},
 {id:"DvRLnXJGZZ0", level:"toefl", kind:"Guía", t:"TOEFL iBT 2026: What Changed and How to Prepare", task:"Escribe qué sección te preocupa más y por qué, en inglés."}
];
