import { useState } from "react";
import { Sparkles, Star } from "lucide-react";
import PhotoFrame from "@/app/components/PhotoFrame";
import LetterModal from "./LetterModal";

// Placeholder images - estas serán reemplazadas por las fotos reales
const placeholderImages = [
    "../img/img_carta2.jpg",
    "../img/arbol1.jpeg",
    "../img/arbol2.jpeg",
    "../img/img_carta1.png",
    "../img/arbol3.jpeg",
    "../img/arbol4.jpeg",
    "../img/arbol5.jpeg",
    "../img/img_carta3.jpg",
    "../img/arbol6.jpeg",
    "../img/img_carta4.jpg",
];

// Cartas ocultas - mensajes románticos
const letters = [
    {
        title: "Mi primer recuerdo contigo",
        content: `Hola, mi amor,

Esta es la carta más importante. Para serte honesto, tenía guardado este tema para nuestro aniversario, pero decidí que debía estar aquí. Es sobre una de mis historias favoritas, una que me ha enseñado lo que realmente significa amar: la de Manolo y María.

¿Qué te puedo decir? Desde el día en vi esa película cuando ya te conocí, aspiré de cierto modo a ser como Manolo. Para mí, él representa el amor más puro y verdadero; ese amor que no se rinde y que es capaz de enfrentar cualquier desafío, incluso los que parecen imposibles, con tal de estar al lado de la persona que ama.

Manolo me enseñó que yo soy quien escribe mi propia historia a tu lado. He aprendido a ignorar el resto del mundo porque, al final, lo único que realmente importa somos nosotros dos. Si hoy tuviera que enfrentar mil desafíos como lo hizo él, lo haría sin dudar, porque tú eres para mí lo que María fue para él: mi valentía, mi inspiración y mi todo.

Gracias por enseñarme que cuando el amor es real, no importa el tiempo, ni la distancia, ni nada. Nada en este mundo puede apagar lo que sentimos. Finalmente, quiero dejarte estas frases que guardo en el corazón porque son nuestra realidad:

• "Esto que sientes es lo que siento cada vez que estoy contigo."
• "Escribe tu propia historia."
• "No tengo nada que dar, solo mi amor."
• "Tal vez no soy el héroe del pueblo, pero te juro con mi corazón que jamás dejaré de amarte."
• "Te amo y más..."

Gracias por dejarme ser el Manolo de tu historia.`,
        videoSrc: "/video/teamoymas.mp4",
    },
    {
        title: "Lo que más amo de ti",
        content: `Hola, mi princesa,

¿Te acuerdas del primer día que nos conocimos? Yo sé que tú tal vez no, o al menos no la primera vez que te vi... pero lo que sé con total seguridad es que la sensación de ese día la recordaré toda la vida.

Fue mágico verte y decir: "voy a hablar con esa chica", incluso sabiendo lo tímido que soy. Hoy, viendo todo lo que ha pasado a lo largo de este año, me doy cuenta de que fue la mejor decisión de mi vida.

Ese día vi lo más hermoso del mundo; fue exactamente como esta escena donde Snoopy ve por primera vez a Fifi: un flechazo directo, un amor a primera vista.

Al igual que él, que se quedó maravillado ante ella, yo no tengo suficientes palabras para decirte lo que sentí en ese instante en que nos conocimos, mi mundo se volvió mucho más brillante, más divertido y, en general, mucho mejor.`,
        videoSrc: "/video/snoopy.mp4",
    },
    {
        title: "Nuestra historia",
        content: `Hola, mi vida...

Esta es la tercera carta. ¿Una película de Halloween que también es navideña? Pues sí, esta es la siguiente...
Sabes, de niño esta película me gustaba muchísimo; junto con El cadáver de la novia, me las repetía demasiado. Pero la principal razón de que Jack y Sally estén aquí es su escena final.

Elegí esta historia especialmente por su última frase, porque en definitiva, nuestro amor es una realidad, hasta la eternidad. No tengo ninguna duda de eso.

Al igual que ellos en esa colina, me he dado cuenta de que no necesito buscar en otros mundos ni en otras realidades, porque contigo lo tengo todo.
Gracias por ser la pieza que le dio sentido a mi propio "extraño mundo" y por estar destinada a estar conmigo.`,
        videoSrc: "/video/jack.mp4",
    },
    {
        title: "Esta Navidad",
        content: `Hola mi amor...

Esta es la primera carta de estas 4 que escribo. El día de hoy quería decirte que eres mi mundo.
Me emociona mucho saber que ya ha pasado una Navidad desde que nos estábamos conociendo; recordar que la primera vez que me regalaste algo fue justamente en una funda navideña es un recuerdo increíble para mí.

Wall-E de pequeño no era de mis pelis favoritas, pero he llegado a encontrarle un sentido distinto. Yo vivía en mi rutina, haciendo lo mío, siempre... y tú lo cambiaste totalmente.

Esa chispa que sentí entre nosotros desde el primer momento fue simplemente mágica. Al igual que en la película, no existen palabras para explicar el amor que te tengo.
Y así como para ellos el gesto más importante fue aprender a sostenerse, yo no tengo que recordartelo, pero no quiero soltarte jamás.`,
        videoSrc: "/video/walle_eva.mp4",
    },
];

// Configuración del árbol (posiciones y rotaciones)
const treeConfig = [
    // Fila 1 (arriba - estrella)
    { row: 1, items: [{ rotation: 0, hasLetter: true, letterIndex: 0 }] },
    // Fila 2
    { row: 2, items: [{ rotation: -5 }, { rotation: 5 }] },
    // Fila 3
    { row: 3, items: [{ rotation: -3, hasLetter: true, letterIndex: 1 }, { rotation: 0 }, { rotation: 4 }] },
    // Fila 4
    { row: 4, items: [{ rotation: -4 }, { rotation: 2, hasLetter: true, letterIndex: 2 }, { rotation: -2 }, { rotation: 5, hasLetter: true, letterIndex: 3 }] },
];

const ChristmasTree = () => {
    let imageIndex = 0;
    const [selectedLetter, setSelectedLetter] = useState<{ title: string; content: string; videoSrc?: string } | null>(null);

    return (
        <>
            <div className="relative flex w-full flex-col items-center gap-3 py-8 sm:gap-4">
                {/* Estrella en la cima */}
                <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 text-christmas-gold animate-twinkle sm:-top-4">
                    <Star
                        className="size-9 sm:size-11"
                        fill="currentColor"
                        strokeWidth={1}
                        aria-hidden="true"
                    />
                </div>

                {treeConfig.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex w-full justify-center gap-2 sm:gap-3 md:gap-4"
                        style={{
                            animationDelay: `${rowIndex * 100}ms`,
                        }}
                    >
                        {row.items.map((item, itemIndex) => {
                            const currentImageIndex = imageIndex++;
                            return (
                                <div
                                    key={itemIndex}
                                    className="w-[clamp(3.5rem,17vw,13rem)]"
                                >
                                    <PhotoFrame
                                        imageSrc={placeholderImages[currentImageIndex % placeholderImages.length]}
                                        rotation={item.rotation}
                                        letter={item.hasLetter ? letters[item.letterIndex!] : undefined}
                                        delay={rowIndex * 150 + itemIndex * 100}
                                        onLetterOpen={() => setSelectedLetter(letters[item.letterIndex!])}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* Tronco del árbol */}
                <div className="mt-6 h-12 w-16 rounded-sm bg-gradient-to-b from-amber-800 to-amber-900 shadow-lg sm:mt-8 sm:h-16 sm:w-24" />

                {/* Decoraciones adicionales */}
                <div className="pointer-events-none absolute left-1/4 top-1/4 text-christmas-gold/70 animate-sparkle" aria-hidden="true">
                    <Sparkles className="size-5" />
                </div>
                <div className="pointer-events-none absolute right-1/4 top-1/3 text-christmas-gold/70 animate-sparkle" aria-hidden="true">
                    <Sparkles className="size-4" />
                </div>
                <div className="pointer-events-none absolute bottom-1/4 left-1/3 text-christmas-gold/70 animate-sparkle" aria-hidden="true">
                    <Sparkles className="size-5" />
                </div>
            </div>

            <LetterModal
                isOpen={!!selectedLetter}
                onClose={() => setSelectedLetter(null)}
                letter={selectedLetter}
            />
        </>
    );
};

export default ChristmasTree;
