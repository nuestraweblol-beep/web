"use client";
import React from 'react';
import "./sueno.css";

const SuenoPage = () => {
    return (
        <>
            <div className="editorial-page">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="main-title">Un Sueño Increíble</h1>
                    </div>
                </section>

                {/* Story Sections */}
                <div className="story-container">

                    {/* Section 1 - Texto Izquierda, Imagen Derecha */}
                    <section className="story-section">
                        <div className="section-content">
                            <div className="text-column">
                                <h2 className="section-title">El Lugar</h2>
                                <p className="section-text">
                                    El lugar simplemente era mágico. Soñé con nuestra boda en una playa espectacular, un escenario tan
                                    impresionante que lo primero que me vino a la mente fue la boda de la película "Ese es mi hijo".
                                    La película es malísima jajaja... pero ese escenario de la boda era simplemente increíble.
                                </p>
                                <p className="section-text">
                                    Pero este lugar era verdaderamente increíble, superando cualquier ficción. La inmensidad del mar tranquilo,
                                    la arena blanca y una brisa suave que movian las telas de las decoraciones creaban una atmósfera única. Se sentía tan real,
                                    como si en ese día todo fuera perfecto.
                                </p>
                            </div>
                            <div className="image-column">
                                <div className="editorial-image">
                                    <div className="image-placeholder">
                                        <img src="/img/lugar.jpeg" alt="Ilustración del sueño" loading="lazy" decoding="async" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 - Imagen Izquierda, Texto Derecha */}
                    <section className="story-section">
                        <div className="section-content">
                            <div className="image-column">
                                <div className="editorial-image">
                                    <div className="image-placeholder">
                                        <img src="/img/vestido.jpeg" alt="Ilustración del sueño" loading="lazy" decoding="async" />
                                    </div>
                                </div>
                            </div>
                            <div className="text-column">
                                <h2 className="section-title">Tú</h2>
                                <p className="section-text">
                                    Te vi en el sueño y simplemente estabas preciosa. Llevabas un vestido hermoso...
                                    por cierto, no encontré ninguna imagen similar al vestido que vi, así que esa parte se queda en mi memoria,
                                    pero te aseguro que era espectacular.
                                </p>
                                <p className="section-text">
                                    Y lo más importante, te veías increíblemente feliz. Ver esa felicidad en tu rostro
                                    fue lo que me hizo inmensamente feliz a mí. Tu sonrisa iluminaba todo el lugar.
                                </p>
                            </div>
                        </div>
                    </section>



                    {/* Section 4 - Imagen Izquierda, Texto Derecha */}
                    <section className="story-section">
                        <div className="section-content">

                            <div className="text-column">
                                <h2 className="section-title">Bajo las Estrellas</h2>
                                <p className="section-text">
                                    No recuerdo exactamente qué pasó después, pero sí tengo grabado que en la noche estábamos en la playa,
                                    solo los dos. Hablando y sentados en la arena, nos acostamos y recordamos todo lo que pasamos juntos
                                    para llegar a este momento, empezando por lo que vivimos en el Secret Garden cuando nos volvimos novios.
                                </p>
                                <p className="section-text">
                                    Fue un momento perfecto. Y quién sabe, tal vez en el futuro pueda reescribir este sueño
                                    con más detalles reales de todo lo que vivamos en el año que viene juntos.
                                </p>
                            </div>
                            <div className="image-column">
                                <div className="editorial-image">
                                    <div className="image-placeholder">
                                        <img src="/img/noche.jpeg" alt="Ilustración del sueño" loading="lazy" decoding="async" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final Section - Texto Izquierda, Imagen Derecha */}
                    <section className="story-section">
                        <div className="section-content">
                            <div className="image-column">
                                <div className="editorial-image">
                                    <div className="image-placeholder">
                                        <img src="/img/anillo.jpeg" alt="Ilustración del sueño" loading="lazy" decoding="async" />
                                    </div>
                                </div>
                            </div>
                            <div className="text-column">
                                <h2 className="section-title">El Anillo</h2>
                                <p className="section-text">
                                    Sobre el anillo, la verdad tengo muchos problemas para acordarme de los detalles exactos.
                                    Lo que sí recuerdo principalmente era que tenía una piedra roja... no sé por qué roja,
                                    en verdad no tengo idea, pero lucía increíble en el sueño.
                                </p>
                                <p className="section-text">
                                    Y en base a esto decidí hoy prometerte lo que ya viste, guardar esas promesa en este anillo,
                                    el cual elegí principalmente por esa piedra roja que vi en mis sueños. Espero que te guste,
                                    a pesar de tal vez no ser un anillo tan tradicional.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* Closing */}
                    <section className="closing-section">
                        <div className="closing-content">
                            <p className="closing-quote">
                                He pensado mucho en nosotros y en ese futuro del que a veces hablamos. Si en algún momento me notas pensativo o serio cuando lo mencionas, no es porque no lo quiera, sino porque soy consciente de todo el camino que aún tenemos por recorrer para llegar ahí.
                            </p>
                            <p className="closing-quote">
                                Construir algo tan bonito y tan sólido toma tiempo. Requiere que sigamos creciendo como personas, en lo profesional y, sobre todo, como pareja. Las cosas grandes no se hacen de la noche a la mañana, pero saber que estamos caminando juntos en esa dirección es lo que de verdad importa para mí.
                            </p>
                            <p className="signature">Te amo mucho, mi amor. </p>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
};

export default SuenoPage;
