"use client";
import { useState, useEffect, useRef, TransitionEvent } from "react";
import { BookOpen, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { chapterArt } from "./ChapterArt";
import "./libro.css";

interface Chapter {
    label: string;
    title: string;
    paragraphs: string[];
}

const carta = {
    label: "Antes de empezar",
    title: "Una carta que quedó pendiente",
    paragraphs: [
        "Pues al final parece que no hubo de otra, Danna...",
        "Creo que, de verdad, ya es imposible que nuestra relación vuelva a parecerse a esa que tanto amaba y que me hacía tan feliz. Y justo mientras escribía esto, me llegó tu mensaje diciendo prácticamente lo mismo. Creo que era la confirmación que me faltaba para entender que, al menos por ahora, este es el final.",
        "Quiero prometerte algo. Al menos durante un buen tiempo, esta será la última vez que me despida de ti. Voy a dejar de ser tan indeciso con toda esta situación, porque siento que ya no tiene sentido seguir dando vueltas a algo que, por más que lo intenté, no está funcionando.",
        "Estos últimos días fueron extraños. Durante dos días realmente pude sentirme muy feliz, casi como si todo estuviera bien otra vez. Intenté disfrutar cada conversación y fingir, incluso para mí mismo, que las cosas podían volver a ser como antes. Pero siempre aparecía algo que me hacía recordar que la realidad era distinta.",
        "Aun así, quiero darte las gracias. De verdad. Esos dos días fueron los primeros, en mucho tiempo, en los que pasé la mayor parte del día tranquilo, feliz y sin pensar constantemente en cosas que me hacían daño. Aunque probablemente ya estés cansada de escucharme decirlo, una vez más quiero agradecerte por haberme regalado el año más feliz de mi vida.",
        "Me voy sin ninguna duda de que lo que sentía por ti era amor de verdad. También me voy con la tranquilidad de saber que, mientras estuvimos juntos, siempre intenté hacerte feliz de la mejor manera que pude. Estos días también intenté buscar una forma de arreglar las cosas, pero entendí que, por mucho que lo deseara, no estaba funcionando.",
        "Quiero que sepas algo que para mí es importante. No existe ningún odio hacia ti. Jamás lo ha existido.",
        "¿Resentimiento? Si soy completamente sincero, todavía hay cosas que me duelen. Todavía siento un nudo en el pecho cuando recuerdo algunos momentos, especialmente después de que terminamos. Hubo situaciones que me hicieron sentir muy mal, como cuando me dijiste que no podías detenerte y que buscara algo que hacer. Supongo que, como fui yo quien quiso terminar la relación y tú quien quería que al menos siguiéramos siendo amigos, imaginé que las cosas serían un poco diferentes entre nosotros. Son recuerdos que todavía me cuestan, pero no te los digo para reclamarte nada. Solo forman parte de lo que sentí y de lo que ahora también estoy aprendiendo a dejar atrás.",
        "Pero odio... nunca. Siempre, absolutamente siempre, voy a desear que te vaya bien.",
        "Y, siendo sincero, me alegra mucho ver que así está siendo. Durante esta semana, hablando un poco más tranquilos, me diste a entender que estás bien. Que sales, que compartes con tus amigos y amigas, que te reúnes con ellos y que estás disfrutando tu vida. De verdad me alegra saberlo. Incluso creo que eso terminó de quitarme esa pequeña espina que tenía cuando antes me decías que no tenías a nadie más que a mí o cosas parecidas. Ahora entiendo que sí puedes seguir adelante, y eso también me da tranquilidad.",
        "También me voy feliz porque confirmé algo que siempre te decía: las cosas las hacías por ti, no por mí. Recuerdo cuando entraste al baile y me dijiste que había sido gracias a mí, pero honestamente nunca lo creí. Tú llegaste hasta avanzado por tu propio esfuerzo, por tu disciplina y seguramente también con el apoyo de otras personas. Yo nunca tuve realmente ese mérito. De hecho, muchas veces intenté animarte y no quisiste hacerlo. Así que, si fuiste tú misma quien encontró la fuerza, o alguien más te dio ese impulso, me alegra muchísimo. Al final entendí que nunca fui el único motivo por el que crecías, y eso está bien.",
        "Fuera de eso, quería contarte algo que probablemente nunca te dije. Mi mamá sabía que todavía hablaba contigo de vez en cuando. Jimmy también. Los dos me decían que ya no lo hiciera, pero yo nunca quise ocultar que seguía hablando con la persona que amo, aunque todo fuera completamente distinto. Así que sí, ellos lo sabían.",
        "Como te dije antes, por mucho tiempo voy a dejar de estar en esta indecisión constante. No quiero seguir despidiéndome para volver a escribirte después. Pero tampoco quiero cerrar mi corazón con llave. Lo único que entendí es que, por ahora, no es posible que estemos juntos. Ya sea por ti, por mí o por todo lo que pasó, hoy hay demasiadas cosas entre nosotros.",
        "Solo espero haber logrado que entiendas cuánto vales. Y, como alguna vez te dije, si algún día llega otra persona a tu vida, deseo de corazón que sea alguien que te ame incluso más de lo que yo lo hice.",
        "Por mi parte, creo que necesito aprender otra vez a estar solo. Es curioso, porque durante casi toda mi vida eso fue lo normal para mí e incluso me gustaba. Pero después de conocerte, volver a esa soledad se volvió mucho más difícil de lo que alguna vez imaginé.",
        "Deseo que sigas creciendo en todo lo que te propongas. En tus estudios, en el básquet, con tus amistades y en cada una de las metas que tengas. De verdad quiero que seas muy feliz.",
        "Sé que probablemente esto nunca pase, pero hay algo que siempre me quedó pendiente. Nunca tuve la oportunidad de agradecerle a tu familia por haberme abierto las puertas de su casa y por hacerme sentir, durante tanto tiempo, como si fuera uno más de ellos. Si algún día se da la oportunidad y no representa ningún problema para ti, solo diles de mi parte: muchas gracias por todo. Siempre voy a guardar ese cariño con muchísimo aprecio.",
        "El día siguiente, cuando escuché el audio donde hablaba la Fabi, me apareció la foto con las “narices de payaso”, y la verdad es que sonreí porque recordé esos momentos. También la extraño mucho a ella, pero sobre todo te extraño a ti.",
        "Cuando hablábamos de vernos de nuevo, sé que muchas veces lo hicimos desde la emoción del momento. Pero en mi mente se quedó muy grabada la idea de poder verte otra vez de cerca, abrazarte y mirarte a los ojos, con la esperanza de volver a encontrar ese amor que sentía en tu mirada y que hace tiempo dejé de ver.",
        "Ahora que dijiste que hablar nos hace daño, en mi caso siento que, de alguna forma, me ha ayudado. Estoy intentando mantener la calma, aceptar lo que está mal y decirte todo, incluso las cosas incómodas o las que podrían alejarte más de mí. Por eso, esta vez no me sentí mal escribiéndote.",
        "También creo que tiene que ver con que estoy intentando “perdonar” todo, no porque crea que hayas hecho algo malo, sino por cómo yo viví y sentí las cosas. Estoy entendiendo mejor lo que pasó y por qué pasó.",
        "Siempre voy a tener ese año como uno de los mejores de mi vida, sin duda alguna, desde el momento en que te vi por primera vez hasta nuestro aniversario. Fueron los momentos más felices, y eso no lo voy a negar nunca.",
        "Hoy vi un TikTok que decía que es imposible borrar a tu primer amor, y sin duda tú eres ese para mí. No creo que te vaya a olvidar jamás.",
        "Tal vez después de esto hablemos un poco más o tal vez no. Pero si envié todo esto es porque sentí que ya no había nada más que pudiera hacer, que es justamente lo que siento ahora.",
        "Como último gesto, al menos por ahora, quería darte unos tulipanes… pero parece que eso ya no se va a dar. Así que en su lugar te dejo este borrador de lo que te había escrito. Originalmente iba a ser un cuento para nuestro aniversario, pero decidí contarte primero lo de nuestra “casi boda”, jajaja.",
        "He soñado mucho con ese “nosotros” en otra realidad, no sé cómo explicarlo.",
        "Creo que sin saber muy bien de qué más hablar, esto es lo que tenía guardado.",
        "Ah… en esa boda hipotética bailábamos Close To You. Sé que siempre fue un poco raro, jajaja, pero la escena de esa canción en Los Simpsons me encanta.",
        "Como ya te dije antes, todas las canciones que te dediqué son realmente tuyas, aunque dijiste que ya no las escuchas. Aun así, cada vez que suene alguna canción que me recuerde a ti, siempre te voy a pensar. Son muchas de mis favoritas.",
        "Como no pude verte de nuevo, me quedo con el recuerdo de tu cara mirándome con ese cariño tan único, cuando te hacía reír o decía alguna estupidez, y se te dibujaba esa sonrisa que me hacía sentir tantas cosas.",
        "Nada de esto cambia lo que te prometí en su momento: quererte toda la vida. Y aunque ya no seamos nada, sigo recordando todas las promesas que hice con ese anillo… que por cierto, Jimmy todavía se burla de mí por eso, jajaja.",
        "Lo uses o no, o incluso si prefieres no decir nada, está bien. Solo espero que lo guardes como recuerdo. No tienes que decir quién te lo dio ni qué significaba. Solo quiero que sepas que ninguna de esas promesas fue falsa, y que si alguna vez fallé, siempre intenté arreglar las cosas.",
        "Y bueno, no me quiero alargar más porque si no no termino nunca, jajaja.",
        "Te amo, princesa linda. Espero que, si no es como novios, al menos podamos coincidir algún día como amigos o conocidos, y volver a ver tu carita preciosa… aunque tus ojos ya no brillen por mí.",
    ],
};

const chapters: Chapter[] = [
    {
        label: "Capítulo 1",
        title: "La princesa del nuevo reino",
        paragraphs: [
            "Hace muchísimo tiempo, en un reino lejano, vivía una princesa.",
            "No era una princesa de esas de cuentos exagerados… bueno, quizá un poco sí. Todos la conocían por su belleza, pero no era eso lo que realmente hacía que la gente se quedara mirándola más de la cuenta. Era la forma en la que estaba presente en todo: inteligente, aplicada, tranquila, de esas personas que sin hacer ruido terminan siendo importantes para todos.",
            "La princesa había empezado una nueva etapa en su vida en un lugar distinto dentro del reino. Era un sitio extraño si lo mirabas desde fuera: ahí convivían todo tipo de personas. Algunos eran príncipes, otros princesas, otros simples estudiantes del reino… y entre bromas internas, cada grupo parecía tener su propio “mundo”.",
            "Entre ellos había también algo que no era exactamente humano, o al menos no del todo en la forma en la que los demás lo eran. Una de esas presencias difíciles de explicar, como si perteneciera más a la imaginación que a la realidad. A esas cosas todos les decían “criaturas”, aunque en el fondo solo eran personas con formas distintas de ser, de sentir, de existir.",
            "Y en medio de todo eso, la princesa simplemente seguía con su vida. Estudiaba. Hablaba con algunos amigos nuevos. Incluso, junto a uno de ellos, empezó a practicar deporte en ese lugar. Todo era normal. Todo parecía parte de una rutina nueva, sin nada fuera de lo común.",
            "Pero había alguien mirándola.",
            "Desde lejos, una de esas “criaturas” la vio.",
            "Y no la vio como la veían los demás.",
            "No fue curiosidad, ni simple atracción. Fue de esas cosas que no se explican bien ni siquiera cuando uno intenta hacerlo.",
            "Fue amor a primera vista.",
            "Esa criatura, que normalmente no era precisamente valiente ni segura de sí misma, se quedó quieta un segundo… y luego, como si algo dentro de él hubiera hablado antes que su cabeza, les dijo a sus amigos con una convicción casi absurda:",
            "—Esa princesa va a ser mi novia.",
            "Ni él mismo se lo creyó del todo cuando lo dijo.",
            "Pero lo que sí era real, era lo que había sentido en ese instante.",
            "Y aunque en ese momento parecía una locura, ahí fue donde todo empezó.",
        ],
    },
    {
        label: "Capítulo 2",
        title: "Amor a primera vista",
        paragraphs: [
            "Durante algún tiempo, la criatura intentó acercarse a la princesa de forma torpe, casi sin saber cómo hacerlo.",
            "No era alguien especialmente hábil para esas cosas. Al contrario, cada intento parecía más una mezcla de nervios y mala coordinación que otra cosa. Incluso hubo una vez en la que, con una inocencia casi infantil, intentó simplemente despedirse dándole la mano… pero la princesa decidió ignorarlo.",
            "Y aunque eso lo dejó un poco confundido, no lo detuvo.",
            "Durante esos días, no podía pensar en otra cosa.",
            "La princesa aparecía en su cabeza de forma constante: su forma de hablar, su presencia tranquila, su belleza que no necesitaba exageraciones. Incluso siendo alguien poco social, encontró una forma extraña de hacer lo contrario a lo que solía hacer: hablar de ella.",
            "Le contaba a otros lo que sentía, lo que veía en ella, como si al decirlo en voz alta pudiera entenderlo mejor él mismo.",
            "Con el tiempo, llegó el momento que cambió todo.",
            "Un día, de alguna manera, terminó entrando al mismo equipo durante un entrenamiento de la princesa.",
            "No sabía muy bien qué hacer con sus manos, ni con sus palabras, ni con su presencia. Así que hizo lo único que se le ocurrió: empezó a decir estupideces.",
            "No con mala intención. Más bien con nervios. Con ese deseo torpe de llamar su atención sin saber realmente cómo hacerlo.",
            "Pero en el fondo había un objetivo claro, aunque él mismo no se atreviera a admitirlo del todo: hacerla reír otra vez.",
            "Y después de varios intentos fallidos, finalmente pasó.",
            "Dijo algo absurdo, algo sin sentido… y la princesa rió.",
            "No fue una carcajada exagerada. Fue algo pequeño, sutil… pero suficiente.",
            "Y para él, fue como si el mundo se hubiera detenido por un segundo.",
            "Una simple sonrisa —o quizá una risa apenas nacida— que en su mente se sintió completa.",
            "En ese instante lo entendió, sin necesidad de explicaciones: esa era la risa que quería ver el resto de su vida.",
        ],
    },
    {
        label: "Capítulo 3",
        title: "Amor que crece en silencio",
        paragraphs: [
            "Después de eso, durante algún tiempo, empezaron a volverse un poco más cercanos.",
            "No de golpe, ni de una forma evidente. Más bien de esas cercanías lentas, casi imperceptibles, que solo uno de los dos termina sintiendo con intensidad.",
            "La criatura todavía temblaba cada vez que la veía. No era una exageración: su voz cambiaba, sus pensamientos se desordenaban, y a veces ni siquiera sabía qué decir. Pero aun así, siempre encontraba una forma de acercarse, aunque fuera mínima.",
            "Porque con solo verla… ya se sentía completo.",
            "Los días pasaban así, entre intentos torpes, pequeñas conversaciones, silencios incómodos y momentos que para él lo significaban todo, aunque para ella probablemente fueran solo parte de lo cotidiano.",
            "Y aunque no había ninguna señal clara de que la princesa sintiera algo parecido, eso no cambiaba nada dentro de él.",
            "De hecho, ocurría lo contrario.",
            "Cada día, sin darse cuenta, se enamoraba más.",
            "No era un amor ruidoso ni desesperado. Era algo constante, silencioso, que crecía sin permiso, incluso cuando la razón intentaba detenerlo.",
            "Y así, entre nervios, miradas y pequeños instantes que él guardaba como si fueran tesoros, esa historia seguía avanzando… aunque todavía ninguno de los dos lo supiera del todo.",
        ],
    },
    {
        label: "Capítulo 4",
        title: "El monstruo del vino",
        paragraphs: [
            "Pero, como en toda historia, un amor no estaría completo sin problemas en el camino…",
            "Y en este reino, los problemas tenían forma.",
            "El primero en aparecer fue conocido como Bacchus, el Monstruo del Vino (Idea de ChatGPT jajaja).",
            "Era una criatura de presencia fácil, de esas que parecen encajar en cualquier lugar sin esfuerzo. Siempre sonriente, siempre cercano, como si supiera exactamente cómo moverse entre los demás sin levantar sospechas.",
            "Empezó a acercarse a la princesa poco a poco.",
            "Le hablaba durante los juegos, le pedía cosas pequeñas, buscaba excusas para estar cerca de ella y, sobre todo, intentaba destacar cuando ella estaba presente.",
            "Para los demás, parecía algo normal.",
            "Para la princesa, también.",
            "Pero para la criatura… no.",
            "Porque cuando uno ama en silencio, cualquier detalle pesa más de lo que debería.",
            "Con el tiempo, Bacchus empezó a ocupar más espacio en la historia, al menos desde la mirada de la criatura. No era necesariamente algo evidente para el mundo… pero en su cabeza sí lo era.",
            "Y entonces ocurrió el momento que lo rompió por dentro.",
            "La princesa se fue con Bacchus.",
            "Hubo cercanía, momentos compartidos, situaciones en las que él estuvo a su lado cuando no estaba bien, y gestos que desde afuera podían parecer normales… pero que para la criatura se sentían como algo demasiado difícil de procesar.",
            "Sintió que algo dentro de él se quebraba.",
            "No dijo nada.",
            "No reclamó nada.",
            "Solo se alejó.",
            "Y en su mente tomó una decisión: no volver a intentarlo.",
            "Pero las historias que realmente importan no terminan cuando uno quiere.",
            "Esa misma noche recordó una historia de otro mundo.",
            "Un personaje que luchaba incluso después de la muerte por la persona que amaba. Caía, volvía a levantarse, insistía una y otra vez… solo por ese amor (Si, el libro de la Vida).",
            "Y en su cabeza nació una idea absurda, casi infantil: “Si él puede… yo también.”",
            "No sabía cómo, pero todavía quería hablar con la princesa.",
            "Y el destino, como si no hubiera terminado de escribir esa historia, hizo lo suyo.",
            "Un día sonó su denden mushi (sí, los teléfonos de One Piece).",
            "Era ella.",
            "La conversación no fue perfecta ni completamente cómoda. Ella habló de lo que había pasado con Bacchus, de cómo él la había acompañado cuando no estaba bien.",
            "Y aunque eso le dolió, lo que más le importó no fue eso.",
            "Fue que ella lo había llamado.",
            "Que todavía existía un hilo entre los dos.",
            "Y eso fue suficiente para que no se soltara.",
            "Con el tiempo, siguieron acercándose otra vez.",
            "Más tranquilos. Más reales. Más ellos.",
            "Hasta que una noche, todo cambió.",
            "La criatura acompañó a la princesa hasta su carruaje al final del día. Caminaban en silencio por la plaza central, bajo una luz suave, casi tranquila.",
            "Y entonces se detuvieron bajo un árbol.",
            "Era una despedida normal.",
            "O eso parecía.",
            "Hasta que la princesa se acercó.",
            "Y le dio un beso ligero.",
            "La criatura se quedó inmóvil.",
            "No lo entendía.",
            "Cómo alguien como ella… podía besarlo a él.",
            "Cómo algo así podía ser real.",
            "Pero lo era.",
            "La princesa, como si el momento la hubiera sobrepasado, intentó irse después de eso.",
            "Pero él la detuvo.",
            "La tomó de la mano.",
            "La acercó.",
            "Y por primera vez dejó que todo lo que sentía dejara de pelear dentro de él.",
            "La tomó de la cintura.",
            "Y la besó.",
            "No fue un beso perfecto.",
            "Fue un beso real.",
            "Un beso lleno de todo lo que había guardado desde el inicio.",
            "De todo lo que nunca se atrevió a decir.",
            "Un instante que lo cambió todo.",
            "Después de eso, caminó de regreso sin pensar en nada más.",
            "Solo temblando.",
            "Solo feliz.",
            "Y desde ese día… ese momento quedó grabado en él para siempre.",
        ],
    },
    {
        label: "Capítulo 5",
        title: "La ilusión que se rompe",
        paragraphs: [
            "Los días siguientes fueron distintos.",
            "La criatura y la princesa se habían acercado más. Besarse ya no era algo extraño entre ellos, sino un momento que para él se había vuelto profundamente importante. Cada vez que la sentía cerca, era inevitable: se enamoraba un poco más, como si no hubiera límite para lo que podía sentir.",
            "Pero incluso en las historias más bonitas, los obstáculos no desaparecen.",
            "Con el tiempo, esa cercanía también se volvió más natural, casi cotidiana. Él empezó a molestarla de forma cariñosa, buscando pequeñas excusas para tocar su mano, para estar cerca, para verla de frente y confirmar que todo eso era real.",
            "Hasta que un día, algo cambió.",
            "Fue durante un juego.",
            "La criatura llegó como siempre, con esa misma ilusión de cada vez que la veía, con esa emoción silenciosa de volver a encontrar a la princesa más hermosa del reino.",
            "Pero lo que vio lo golpeó de una forma distinta.",
            "La princesa estaba riendo y hablando con un segundo monstruo.",
            "Uno que no le agradaba del todo. Un monstruo que parecía ocupar espacio sin esfuerzo, como si encajara demasiado fácil en ese momento.",
            "No fue solo eso.",
            "Cuando la criatura intentó acercarse, la princesa respondió con cierto enojo. Tal vez estrés. Tal vez cansancio. Tal vez algo que él no supo leer en ese momento.",
            "Pero no importó la razón.",
            "En su mente, todo se rompió.",
            "Durante el resto del día, fue testigo de cómo ese monstruo intentaba acercarse a la princesa, y cómo ella respondía con amabilidad, sin notar lo que eso generaba en él.",
            "Y eso lo llevó al límite.",
            "Sintió que todo se le desmoronaba.",
            "Sin decir mucho, decidió alejarse ese día.",
            "No por orgullo. Sino porque no sabía qué más hacer con lo que estaba sintiendo.",
            "Más tarde, en el entrenamiento oficial, volvió.",
            "Pero ya no era el mismo.",
            "Volvió con una idea clara en la cabeza, aunque dolorosa: quizá ella podía ser feliz con alguien más… y no con él.",
            "La tarde fue pesada.",
            "Él pensaba demasiado. Ella conversaba con el segundo monstruo. El ambiente se sentía distante, incómodo, como si algo se hubiera roto sin que nadie lo dijera en voz alta.",
            "Pero en algún momento, él ya no pudo más.",
            "No pudo seguir actuando como si todo estuviera bien.",
            "La buscó.",
            "Y sin pensar demasiado… la besó.",
            "Un beso repentino. Inesperado. Inmenso en significado para él.",
            "Un beso en medio de la cancha, frente a todos.",
            "Un instante que parecía detener el tiempo.",
            "No fue perfecto.",
            "No fue planeado.",
            "Pero fue real.",
            "Y en su mente, en ese momento, fue lo único que necesitaban para volver a encontrarse.",
        ],
    },
    {
        label: "Capítulo 6",
        title: "El día en que el destino sonrió",
        paragraphs: [
            "Aun así, esa sensación dentro de la criatura nunca desapareció del todo.",
            "Había dudas, inseguridades, momentos difíciles… pero, por encima de todo eso, siempre terminaba eligiendo lo mismo: a la princesa que tanto amaba.",
            "Y con el tiempo, decidió dar un paso más.",
            "Quería, por fin, hacer oficial lo que sentía. Quería dejar de vivirlo a medias, de forma silenciosa o incierta. Quería convertirlo en algo real.",
            "Durante días, guardó sus ahorros con una sola idea en la mente: hacer de ese momento algo especial.",
            "No buscaba el lugar más perfecto del mundo, ni los regalos más impresionantes.",
            "No era eso.",
            "Cada detalle que preparaba no era para “comprar amor”, sino para mostrarle algo mucho más simple y más sincero: lo importante que ella era para él.",
            "Y de alguna forma… ese día parecía distinto.",
            "Como si el mundo, por una vez, estuviera de su lado.",
            "El aire se sentía más ligero. Las cosas salían mejor de lo esperado. Incluso los pequeños momentos parecían alinearse con una especie de magia invisible.",
            "Como si el destino estuviera ayudando en silencio.",
            "Corazones dibujados en los lugares más inesperados, canciones que aparecían en el momento justo, una sensación constante de que algo bueno estaba por pasar.",
            "Y entre todo eso… el amor simplemente fluía.",
            "Después de comer juntos, el nerviosismo empezó a crecer dentro de la criatura.",
            "Cada paso le pesaba un poco más que el anterior. Le temblaban las manos, las piernas, incluso la voz en su cabeza parecía dudar.",
            "Tenía miedo.",
            "Miedo de arruinarlo. Miedo de no ser suficiente. Miedo de que ese momento no fuera lo que él había imaginado tantas veces.",
            "Pero aun así, decidió dar el paso.",
            "Respiró hondo.",
            "Y se detuvo frente a la princesa más hermosa del reino.",
            "Con el corazón al borde del colapso, hizo la pregunta que lo había estado persiguiendo desde el inicio de toda esta historia:",
            "—¿Quieres ser mi novia?",
            "El mundo pareció detenerse.",
            "Todo el ruido, todas las dudas, todo desapareció por un segundo.",
            "Solo quedaron ellos dos.",
            "La princesa, también con algo de nerviosismo, lo miró y sonrió.",
            "Una sonrisa suave… de esas que calman incluso lo que uno no sabía que tenía roto por dentro.",
            "Y entonces dijo que sí.",
            "Un “sí” pequeño en palabras… pero enorme en significado.",
            "El día más increíble de su vida.",
        ],
    },
    {
        label: "Capítulo 7",
        title: "El cambio que ella trajo",
        paragraphs: [
            "La princesa, sin duda, cambió a la criatura.",
            "Él era, en su propia historia, alguien común. Un don nadie que había terminado desviándose de su camino, de sus hábitos y hasta de sus propias convicciones.",
            "Pero cuando ella apareció en su vida, algo en él cambió.",
            "No de forma superficial… sino profunda.",
            "Quiso convertirse en alguien mejor.",
            "No por obligación. No por presión.",
            "Sino por ella.",
            "Por la princesa.",
            "Para poder darle lo mejor de sí mismo, para cuidar ese amor como si fuera algo que debía protegerse todos los días.",
            "Y así, su vida dio un vuelco.",
            "Dejó atrás muchos de sus malos hábitos. Aquello que antes ocupaba su tiempo o sus decisiones perdió importancia. Incluso sus Berrys (como él los llamaba en su mundo interno) dejaron de gastarse en cosas sin sentido y empezaron a tener un propósito distinto: construir momentos con ella, vivir algo que sintiera verdadero.",
            "Nunca había tenido una razón más fuerte para ser feliz.",
            "Y poco a poco, la princesa se convirtió en su lugar seguro.",
            "La única persona en la que realmente confiaba.",
            "Él nunca había sido alguien de abrirse fácilmente. Ni siquiera con las personas más cercanas. Siempre había una barrera, algo que no terminaba de encajar, algo que lo mantenía a cierta distancia del mundo.",
            "Pero con ella era distinto.",
            "Con ella se sentía conectado.",
            "Seguro.",
            "En paz.",
            "Como si por fin el mundo tuviera sentido cuando ella estaba cerca.",
            "Él siempre pensó que con esa princesa tan preciosa… simplemente había hecho click.",
            "(Si, también hay referencia a Hotel Transilvania.)",
            "Y así, sin darse cuenta, empezó a describirla en su mente como el amor de su alma.",
            "Porque para él, la vida se quedaba corta frente a todo lo que sentía por ella.",
        ],
    },
    {
        label: "Capítulo 8",
        title: "Cuando todo empezó a romperse",
        paragraphs: [
            "Después de muchas aventuras juntos, algo pasó.",
            "Algo se rompió.",
            "La criatura, a pesar de no tener la vida más fácil, siempre había tenido una cierta calma en su interior. Y más aún desde que conoció al amor de su alma.",
            "Pero la vida, como suele hacerlo, cambió el ritmo de golpe.",
            "Empezaron los problemas. Uno tras otro. Problemas que lo afectaron más de lo que él mismo sabía explicar. Y, por primera vez en mucho tiempo, su mundo dejó de sentirse estable.",
            "Fue un momento difícil. Probablemente el más duro de su vida.",
            "Y, como siempre había hecho en sus peores momentos, eligió encerrarse en sí mismo.",
            "Eligió la soledad.",
            "Sin quererlo del todo… alejó a la princesa.",
            "Qué irónico, ¿no? Encontrar al amor de tu vida y alejarlo justo cuando más lo necesitabas.",
            "Pero así era él. O al menos así creía ser en ese momento.",
            "La princesa, evidentemente, se sintió herida por eso. Y decidió seguir con su vida por su lado.",
            "Era lo correcto, en cierto sentido. ¿Cómo podría él reclamar algo, si fue él quien la alejó primero?",
            "Aun así, nunca dejó de extrañarla.",
            "Nunca dejó de necesitarla.",
            "El dolor volvió.",
            "Ese sentimiento conocido de estar solo.",
            "Él nunca había sido una persona realmente “amada” o profundamente querida, y por primera vez había sentido algo distinto. Algo bonito. Algo real.",
            "Y tal vez… no supo cómo sostenerlo.",
            "Tal vez le quedó grande.",
            "Cuando intentó volver a ella, cuando quiso retomar lo que alguna vez tuvieron, se dio cuenta de algo inevitable: la había ido perdiendo poco a poco.",
            "Ella había conocido más gente.",
            "Se había acercado a otros.",
            "Y estaba mejor sin él.",
            "Era válido.",
            "Era entendible.",
            "Pero aun así… el corazón de la criatura se rompió.",
            "Porque aunque todo alrededor cambiara, él todavía la necesitaba.",
            "Y aunque parecía que el peor momento había pasado, en realidad apenas estaba comenzando.",
            "Porque después de eso vinieron los meses más difíciles de su vida.",
            "Problema tras problema.",
            "Día tras día.",
            "Y de nuevo, estaba solo.",
            "Lo curioso es que, incluso sintiéndose traicionado, incluso después de que la persona que prometió amor eterno se alejara…",
            "Nunca dejó de amarla.",
            "Nunca dejó de extrañarla.",
        ],
    },
];

const epilogo = {
    label: "Epílogo",
    title: "¿Continuará?",
    paragraphs: [
        "Hoy, no hay nada seguro… nada es certero.",
        "Pese a que todavía existe cariño, queda la pregunta inevitable: ¿aún existe amor?",
        "Porque sí, la criatura puede seguir amándola. Puede seguir recordándola. Puede incluso seguir sintiendo que ella es parte de su historia.",
        "Pero el amor, al final, no es solo lo que uno siente.",
        "El amor nace cuando dos personas comparten una conexión… y la sostienen.",
        "Y esa es justamente la parte que, con el tiempo, se fue perdiendo.",
        "Lo que alguna vez fue cercano, claro y vivo… hoy es distinto. Más lejano. Más incierto.",
        "Aun así, el destino es extraño.",
        "Nunca funciona de forma completamente lógica. A veces une, a veces separa, y a veces simplemente deja historias abiertas sin explicación.",
        "Y entonces queda esa duda…",
        "¿qué pasará después?",
        "Porque tal vez esto no sea un final definitivo.",
        "Tal vez solo sea una pausa.",
    ],
};

type PageKind = "carta" | "chapter" | "epilogo";

interface PageData {
    kind: PageKind;
    label: string;
    title: string;
    paragraphs: string[];
}

const pages: PageData[] = [
    { kind: "carta", label: carta.label, title: carta.title, paragraphs: carta.paragraphs },
    ...chapters.map((c) => ({ kind: "chapter" as const, label: c.label, title: c.title, paragraphs: c.paragraphs })),
    { kind: "epilogo", label: epilogo.label, title: epilogo.title, paragraphs: epilogo.paragraphs },
];

function PageFace({ page, pageNumber }: { page: PageData; pageNumber: number }) {
    const isCarta = page.kind === "carta";
    const isEpilogo = page.kind === "epilogo";

    return (
        <article
            className={`libro-chapter ${isCarta ? "libro-carta" : ""} ${isEpilogo ? "libro-epilogo" : ""}`}
        >
            <span className="libro-chapter-label">{page.label}</span>
            <h2 className="libro-chapter-title">{page.title}</h2>
            <div className="libro-text">
                {page.paragraphs.map((p, i) => (
                    <p key={i} className={p.startsWith("—") ? "dialogo" : undefined}>
                        {p}
                    </p>
                ))}
            </div>

            {isCarta && <p className="libro-firma">— con todo el cariño con el que se escribió</p>}

            {isEpilogo && (
                <>
                    <p className="libro-continuara">Continuará…</p>
                    <p className="libro-firma">Dicen que las mejores historias siempre tienen una segunda parte.</p>
                </>
            )}

            {!isCarta && (
                <div className="libro-image-slot">
                    {chapterArt[page.label] ? (
                        chapterArt[page.label]()
                    ) : (
                        <>
                            <Camera className="w-8 h-8" strokeWidth={1.5} />
                            <span>Fotografía · {page.label}</span>
                        </>
                    )}
                </div>
            )}

            <div className="libro-page-number">— {pageNumber} —</div>
        </article>
    );
}

interface FlipState {
    dir: "next" | "prev";
    from: number;
    to: number;
    active: boolean;
}

export default function LibroPage() {
    const [index, setIndex] = useState(0);
    const [flip, setFlip] = useState<FlipState | null>(null);
    const total = pages.length;

    const goTo = (dir: "next" | "prev") => {
        if (flip) return;
        const to = dir === "next" ? index + 1 : index - 1;
        if (to < 0 || to >= total) return;
        setFlip({ dir, from: index, to, active: false });
    };

    useEffect(() => {
        if (!flip || flip.active) return;
        const raf = requestAnimationFrame(() => {
            requestAnimationFrame(() => setFlip((f) => (f ? { ...f, active: true } : f)));
        });
        return () => cancelAnimationFrame(raf);
    }, [flip]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goTo("next");
            if (e.key === "ArrowLeft") goTo("prev");
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    // Swipe left/right on the book to turn pages on touch devices.
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.changedTouches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStart.current.x;
        const dy = touch.clientY - touchStart.current.y;
        touchStart.current = null;

        // Ignore vertical gestures (reading/scroll inside the page).
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        goTo(dx < 0 ? "next" : "prev");
    };

    const handleFlipEnd = (e: TransitionEvent) => {
        if (e.propertyName !== "transform" || !flip) return;
        setIndex(flip.to);
        setFlip(null);
    };

    const shownIndex = flip ? flip.to : index;

    return (
        <div className="libro-page">
            <section className="libro-hero">
                <div className="libro-hero-content">
                    <div className="libro-ribbon">
                        <BookOpen className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <h1 className="libro-title">Nuestra Historia</h1>
                    <p className="libro-subtitle">Un libro de despedida temporal</p>
                    <div className="libro-divider-top" />
                </div>
            </section>

            <div className="libro-book">
                <div
                    className="libro-stage"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <button
                        className="libro-edge libro-edge-left"
                        onClick={() => goTo("prev")}
                        disabled={!!flip || index === 0}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        className="libro-edge libro-edge-right"
                        onClick={() => goTo("next")}
                        disabled={!!flip || index === total - 1}
                        aria-label="Página siguiente"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="libro-leaf libro-leaf-base">
                        <PageFace page={pages[shownIndex]} pageNumber={shownIndex + 1} />
                    </div>

                    {flip && (
                        <div
                            className={`libro-leaf libro-leaf-top leaf-${flip.dir} ${flip.active ? "leaf-active" : ""}`}
                            onTransitionEnd={handleFlipEnd}
                        >
                            <PageFace page={pages[flip.from]} pageNumber={flip.from + 1} />
                        </div>
                    )}
                </div>

                <div className="libro-nav">
                    <button
                        className="libro-nav-btn"
                        onClick={() => goTo("prev")}
                        disabled={!!flip || index === 0}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="libro-nav-count">
                        {shownIndex + 1} / {total}
                    </span>
                    <button
                        className="libro-nav-btn"
                        onClick={() => goTo("next")}
                        disabled={!!flip || index === total - 1}
                        aria-label="Página siguiente"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
