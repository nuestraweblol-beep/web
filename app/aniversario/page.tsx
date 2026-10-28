"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from "../components/header";
import "./aniversario.css";

const AniversarioPage = () => {
    return (
        <>
            <Navbar />
            <div className="anniversary-page">

                {/* Hero Section */}
                <section className="hero-anniversary">
                    <div className="hero-decorator heart-left">♥</div>
                    <div className="hero-decorator heart-right">♥</div>
                    <div className="hero-decorator heart-top">♥</div>

                    <div className="hero-content-anniversary">
                        <p className="hero-subtitle-anniversary">ESTE MOMENTO SERÁ INOLVIDABLE</p>
                        <h1 className="hero-title-anniversary">
                            Aunque... Contigo <br />
                            <span className="title-highlight">cada día es especial</span>
                        </h1>
                        <p className="hero-text-anniversary">
                            Porque lo que empezó como un día de entrenamiento más se convirtió en la<br />
                            historia más bonita de mi vida.
                        </p>
                    </div>

                    <div className="scroll-indicator">
                        <p>Desplaza para continuar</p>
                        <div className="scroll-icon">
                            <div className="scroll-wheel"></div>
                        </div>
                    </div>
                </section>

                {/* Letter Section */}
                <section className="letter-section">
                    <div className="letter-header">
                        <p className="letter-category">NUESTRA PRIMER AÑO</p>
                        <h2 className="letter-title">Una carta para ti</h2>
                    </div>

                    <div className="letter-card">
                        <div className="letter-content">
                            <p className="letter-greeting">Hola mi amoooor…</p>

                            <p className="letter-paragraph">
                                Hoy llegó el día de nuestro aniversario, y todavía me parece increíble pensar en todo el tiempo que hemos pasado juntos. Ha sido un año lleno de momentos hermosos, de risas, de abrazos que sanan, pero también de días difíciles, de pruebas y de retos. Aun así, lo que más valoro es que, incluso en los momentos complicados, siempre luchamos por estar juntos. Y eso, para mí, significa muchísimo más de lo que te imaginas.
                            </p>

                            <p className="letter-paragraph">
                                Hoy quiero decirte que de verdad espero poder disfrutar muchos años más a tu lado. No tengo idea de qué pasará mañana, ni cómo será el próximo año. Tal vez nuestra rutina cambie, tal vez la vida nos ponga nuevos desafíos. Pero hay algo de lo que sí estoy seguro: quiero seguir eligiéndote cada día y prometo amarte todo el tiempo que sea posible, en las buenas y en las malas.
                            </p>

                            <p className="letter-paragraph">
                                No sabes lo mucho que he disfrutado este año poder verte tan seguido, acompañarte casi todos los días, compartir momentos simples que se volvieron especiales solo por estar contigo. Disfruté cada salida, cada mes que celebramos lo mucho que nos amamos, cada instante en el que sentí que estar a tu lado es simplemente increíble.
                            </p>

                            <p className="letter-paragraph">
                                Gracias por ser mi apoyo, mi alegría, mi calma y también mi impulso para seguir adelante. Gracias por amarme como lo haces y por permitirme amarte de la misma manera. Hoy quiero que juntos celebremos nuestro amor, nuestra historia y todo lo que aún nos falta por vivir juntos. Te amo más de lo que puedes imaginar.

                            </p>

                            <p className="letter-paragraph highlight-paragraph">
                                El día de hoy, con tu regalo, quiero que sepas que te prometo:
                                <br />
                                1. Prometo amarte incluso en los momentos en que nos enojamos..
                                <br />
                                2. Prometo mimarte siempre que sea posible..
                                <br />
                                3. Prometo ser más abierto con mis sentimientos.
                                <br />
                                4. Prometo intentar mejorar cada día, aunque sea un poco.
                                <br />
                                5. Prometo respetar tus emociones, aunque no siempre las entienda.
                                <br />
                                6. Prometo apoyarte en tus días buenos y en los no tan buenos.
                                <br />
                                7. Prometo esforzarme por comunicarme mejor contigo.
                                <br />
                                8. Prometo celebrar tus logros, grandes o pequeños.
                                <br />
                                9. Prometo intentar no irme a dormir enojado sin importar que.
                                <br />
                                10. Prometo darte tu espacio cuando lo necesites.
                                <br />
                                11. Prometo ser honesto contigo.
                                <br />
                                12. Prometo hacerte reír cuando pueda.
                                <br />
                                13. Prometo no dar tu amor por sentado.
                                <br />
                                14. Prometo confiar en ti.
                                <br />
                                15. Prometo molestarte aunque me pelees.
                                <br />
                                16. Prometo aprender a amar mejor.
                                <br />
                                17. Prometo compartir mis miedos contigo.
                                <br />
                                18. Prometo no dejar que el orgullo me gane.
                                <br />
                                19. Prometo esforzarme por entenderte mejor.
                                <br />
                                20. Prometo seguir caminando a tu lado mientras tenga la posibilidad.
                            </p>

                            <p className="letter-signature">
                                Te amo de aquí a la luna a pasitos de tortuga.❤️🐢<br />
                                <span>Hoy y siempre</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Memories Gallery */}
                <section className="memories-section">
                    <div className="memories-header">
                        <p className="memories-category">12 MESES DE FELICIDAD</p>
                        <h2 className="memories-title">Nuestros recuerdos</h2>
                        <p className="memories-subtitle">Un poquito de nuestro primer añito juntos</p>
                    </div>

                    <div className="memories-grid">
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/enero.jpg" alt="Enero" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                {/* Falta imagen de febrero en la carpeta public/img */}
                                <span className="memory-icon"><img src="/img/febrero.jpg" alt="Febrero" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/marzo.png" alt="Marzo" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                {/* Falta imagen de abril en la carpeta public/img */}
                                <span className="memory-icon"><img src="/img/abril.jpg" alt="Abril" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/mayo.jpg" alt="Mayo" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/junio.jpg" alt="Junio" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/julio.jpg" alt="Julio" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/agosto.jpg" alt="Agosto" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/septiembre.jpg" alt="Septiembre" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/octubre.jpg" alt="Octubre" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/noviembre.png" alt="Noviembre" /></span>
                            </div>
                        </div>
                        <div className="memory-card">
                            <div className="memory-placeholder">
                                <span className="memory-icon"><img src="/img/diciembre.jpg" alt="Diciembre" /></span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="cta-section">
                    <div className="cta-content">
                        <p className="cta-category">UN POQUITO MÁS</p>
                        <h2 className="cta-title">
                            Mi sueño aunque<br />
                            <span className="cta-highlight"> aun falta mucho por recorrer</span>
                        </h2>


                        <Link href="/sueno" className="cta-button">
                            <span className="button-icon">✨</span>
                            Algo extra para ti
                            <span className="button-heart">♥</span>
                        </Link>
                    </div>


                </section>

            </div>
        </>
    );
};

export default AniversarioPage;
