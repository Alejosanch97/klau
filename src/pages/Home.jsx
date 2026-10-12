import { useState, useEffect, useRef, useCallback } from "react";
import "../Styles/home.css";

/* ═══════════════ HELPERS ═══════════════ */
const cld = (url, t = "f_auto,q_auto,w_1080") => url.replace("/upload/", `/upload/${t}/`);
const pad = (n) => String(n).padStart(2, "0");

/* ═══════════════ DATA ═══════════════ */
const CDN = "https://res.cloudinary.com/k44zr7ap/image/upload";
const AVATAR = `${CDN}/v1791825698/SaveClip.App_476723140_18487000468029410_4441637147968269708_n.jpg`;

const PHOTOS = [
	`${CDN}/v1791825697/SaveClip.App_491534690_18502015090029410_5112330908315293983_n.jpg`,
	`${CDN}/v1791825696/SaveClip.App_491894430_18502015108029410_729550400175262685_n.jpg`,
	`${CDN}/v1791825697/SaveClip.App_491570838_18502015099029410_6515023602907358827_n.jpg`,
	`${CDN}/v1791825697/SaveClip.App_486061496_18495401749029410_8549634147045799558_n.jpg`,
	`${CDN}/v1791825698/SaveClip.App_486004129_18495401740029410_893283267816419671_n.jpg`,
	`${CDN}/v1791825700/SaveClip.App_486700435_18495401731029410_3462194087933322774_n.jpg`,
	`${CDN}/v1791825700/SaveClip.App_565474384_18535140022029410_1942096953521462177_n.jpg`,
	`${CDN}/v1791825699/SaveClip.App_565770624_18535140013029410_2471529293245361139_n.jpg`,
	`${CDN}/v1791825699/SaveClip.App_564424089_18535140031029410_292007542465332725_n.jpg`,
	`${CDN}/v1791825700/SaveClip.App_567516226_18536366188029410_8938600477473839047_n.jpg`,
	`${CDN}/v1791825699/SaveClip.App_567955236_18536366179029410_4076547325010242130_n.jpg`,
	`${CDN}/v1791825698/SaveClip.App_567612588_18536366197029410_7894178153674553292_n.jpg`,
	`${CDN}/v1791825696/SaveClip.App_671823334_18582486934029410_7892690147809457128_n.jpg`,
	`${CDN}/v1791825697/SaveClip.App_670929449_18582486925029410_8697586236352632722_n.jpg`,
];

// 👉 Elige la foto de portada (la más "cover" de todas). Cambia el índice si quieres otra.
const COVER = PHOTOS[0];

const EMAIL = "klaudiambg@gmail.com";
const IG_URL = "https://www.instagram.com/klaudiabrice/";
const TT_URL = "https://www.tiktok.com/@klaudiabrice";
// 👉 Pega aquí el link COMPLETO de su comp card en Canva. Si queda vacío, el botón no aparece.
const COMP_CARD_URL = "";

const BOOKING_MAIL = `mailto:${EMAIL}?subject=${encodeURIComponent("Booking — Klaudia Briceño")}&body=${encodeURIComponent(
	"Hola Klaudia,\n\nTe escribo para una propuesta:\n\n• Tipo de trabajo (campaña, editorial, catálogo, pasarela…):\n• Fecha(s):\n• Ciudad:\n• Marca / cliente:\n\n¡Gracias!"
)}`;

const SERVICES = ["Comercial", "Editorial", "Beauty", "Catálogo", "Pasarela"];
const HEADLINES = ["Natural.", "Versátil.", "Profesional."];
const DESTINOS = [
	{ c: "Bahamas", k: "BHS", r: -8, tone: "ink" },
	{ c: "México", k: "MEX", r: 6, tone: "honey" },
	{ c: "Brasil", k: "BRA", r: -4, tone: "red" },
	{ c: "Panamá", k: "PAN", r: 9, tone: "ink" },
	{ c: "España", k: "ESP", r: -10, tone: "honey" },
	{ c: "Italia", k: "ITA", r: 5, tone: "red" },
];

// Patrón de la revista: grande + 2 pequeñas, 2 medias, 1 panorámica (se repite)
const LAYOUT = ["big", "small", "small", "half", "half", "full"];
const layoutFor = (i, n) => {
	const tailStart = Math.floor(n / 6) * 6;
	if (i < tailStart) return LAYOUT[i % 6];
	const remaining = n - tailStart;
	if (remaining % 2 === 1 && i === n - 1) return "full";
	return "half";
};

/* ═══════════════ HOOKS ═══════════════ */
const useCountUp = (target, start, duration = 1800) => {
	const [v, setV] = useState(0);
	useEffect(() => {
		if (!start) return;
		let raf;
		const t0 = performance.now();
		const tick = (now) => {
			const p = Math.min(1, (now - t0) / duration);
			setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [target, start, duration]);
	return v;
};

/* ═══════════════ ICONS ═══════════════ */
const Icon = ({ name, size = 20 }) => {
	const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
	switch (name) {
		case "instagram": return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg>;
		case "tiktok": return <svg {...p}><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></svg>;
		case "mail": return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
		case "card": return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h8M8 11h8M8 15h5" /></svg>;
		case "arrow": return <svg {...p}><path d="M7 17L17 7M8 7h9v9" /></svg>;
		case "user": return <svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>;
		case "copy": return <svg {...p}><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M4 16V5a1 1 0 0 1 1-1h11" /></svg>;
		default: return null;
	}
};

/* ═══════════════ PIEZAS ═══════════════ */
const SectionHead = ({ n, title, note }) => (
	<div className="kb-sh" data-reveal>
		<span className="kb-sh-n">{n}</span>
		<h2>{title}</h2>
		{note && <em>{note}</em>}
	</div>
);

const Lightbox = ({ start, onClose }) => {
	const n = PHOTOS.length;
	const [i, setI] = useState(start);
	const sx = useRef(null);
	const thumbsRef = useRef(null);
	const go = useCallback((d) => setI((v) => (v + d + n) % n), [n]);

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight") go(1);
			if (e.key === "ArrowLeft") go(-1);
		};
		window.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [go, onClose]);

	// Precarga vecinas + centra la miniatura activa
	useEffect(() => {
		[1, -1].forEach((d) => {
			const img = new Image();
			img.src = cld(PHOTOS[(i + d + n) % n], "f_auto,q_auto,w_1400");
		});
		thumbsRef.current?.children[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
	}, [i, n]);

	const onDown = (e) => (sx.current = e.clientX);
	const onUp = (e) => {
		if (sx.current === null) return;
		const dx = e.clientX - sx.current;
		sx.current = null;
		if (dx < -40) go(1);
		else if (dx > 40) go(-1);
	};
	const stop = (e) => e.stopPropagation();

	return (
		<div className="kb-lb" role="dialog" aria-modal="true" aria-label="Lookbook de Klaudia Briceño">
			<header className="kb-lb-top">
				<span>Klaudia Briceño — <i>Lookbook</i></span>
				<button onClick={onClose}>Cerrar ✕</button>
			</header>

			<div className="kb-lb-stage" onPointerDown={onDown} onPointerUp={onUp}>
				<img key={i} src={cld(PHOTOS[i], "f_auto,q_auto,w_1400")} alt={`Look ${i + 1}`} draggable={false} />
				<button className="kb-lb-nav prev" onPointerDown={stop} onClick={() => go(-1)} aria-label="Anterior">←</button>
				<button className="kb-lb-nav next" onPointerDown={stop} onClick={() => go(1)} aria-label="Siguiente">→</button>
			</div>

			<footer className="kb-lb-bottom">
				<span className="kb-lb-count"><b>{pad(i + 1)}</b> / {pad(n)}</span>
				<div className="kb-lb-thumbs" ref={thumbsRef}>
					{PHOTOS.map((p, j) => (
						<button key={j} className={j === i ? "on" : ""} onClick={() => setI(j)} aria-label={`Ver look ${j + 1}`}>
							<img src={cld(p, "f_auto,q_auto,w_140")} alt="" />
						</button>
					))}
				</div>
			</footer>
		</div>
	);
};

/* ═══════════════ HOME ═══════════════ */
export const Home = () => {
	const [mounted, setMounted] = useState(false);
	const [view, setView] = useState("mag"); // mag | sheet
	const [lb, setLb] = useState(null);
	const [bar, setBar] = useState(false);
	const [specsIn, setSpecsIn] = useState(false);
	const [toast, setToast] = useState("");
	const specsRef = useRef(null);

	useEffect(() => {
		const r = requestAnimationFrame(() => setMounted(true));
		return () => cancelAnimationFrame(r);
	}, []);

	// Barra superior que aparece al pasar la portada
	useEffect(() => {
		const onScroll = () => setBar(window.scrollY > window.innerHeight * 0.75);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Revelado al hacer scroll (usa data-visible para no pelear con React)
	useEffect(() => {
		const els = document.querySelectorAll("[data-reveal]:not([data-visible])");
		const io = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => {
					if (e.isIntersecting) {
						e.target.dataset.visible = "true";
						io.unobserve(e.target);
					}
				}),
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, [view]);

	// Las medidas cuentan cuando la comp card entra en pantalla
	useEffect(() => {
		const el = specsRef.current;
		if (!el) return;
		const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSpecsIn(true), io.disconnect()), { threshold: 0.3 });
		io.observe(el);
		return () => io.disconnect();
	}, []);

	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(""), 2200);
		return () => clearTimeout(t);
	}, [toast]);

	const height = useCountUp(170, specsIn);
	const weight = useCountUp(58, specsIn);
	const shoe = useCountUp(38, specsIn);
	const bust = useCountUp(90, specsIn);
	const waist = useCountUp(67, specsIn);
	const hip = useCountUp(90, specsIn);

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(EMAIL);
			setToast("Email copiado ✓");
		} catch {
			setToast(EMAIL);
		}
	};

	// Descarga una tarjeta de contacto (.vcf) para que agencias y marcas la guarden en su celular
	const saveContact = () => {
		const vcard = [
			"BEGIN:VCARD",
			"VERSION:3.0",
			"N:Briceño;Klaudia;;;",
			"FN:Klaudia Briceño",
			"TITLE:Modelo comercial y de pasarela",
			`EMAIL;TYPE=INTERNET:${EMAIL}`,
			`URL:${window.location.href}`,
			"NOTE:Instagram y TikTok: @klaudiabrice",
			"END:VCARD",
		].join("\n");
		const url = URL.createObjectURL(new Blob([vcard], { type: "text/vcard;charset=utf-8" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = "Klaudia-Briceno.vcf";
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
		setToast("Contacto descargado ✓");
	};

	const closeLb = useCallback(() => setLb(null), []);
	let fullCount = 0;

	return (
		<div className={`kb-wrap ${mounted ? "is-in" : ""}`}>
			<span className="kb-side left" aria-hidden="true">KLAUDIA BRICEÑO — PORTFOLIO {new Date().getFullYear()}</span>
			<span className="kb-side right" aria-hidden="true">COMERCIAL · EDITORIAL · BEAUTY · PASARELA</span>

			{/* Barra fija */}
			<div className={`kb-bar ${bar ? "on" : ""}`}>
				<span className="kb-bar-name">Klaudia <i>Briceño</i></span>
				<a href="#booking" className="kb-bar-cta">Booking</a>
			</div>

			<main className="kb-page">
				<div className="kb-grain" aria-hidden="true" />

				{/* ─── PORTADA ─── */}
				<section className="kb-cover">
					<div className="kb-cover-img">
						<img src={cld(COVER, "f_auto,q_auto,w_1200")} alt="Klaudia Briceño" />
					</div>
					<div className="kb-cover-shade" />
					<div className="kb-mast-top">
						<span>N° 01</span>
						<span>Portfolio</span>
						<span>{new Date().getFullYear()}</span>
					</div>
					<h1 className="kb-mast">
						<span className="kb-mask"><span>KLAUDIA</span></span>
						<span className="kb-mask sub"><span>Briceño</span></span>
					</h1>
					<div className="kb-coverlines">
						<p><b>Modelo</b> comercial & de pasarela</p>
						<p className="it">Editorial · Beauty · Catálogo</p>
					</div>
					<div className="kb-cover-foot">
						<span>Colombia / Venezuela</span>
						<span className="kb-scroll">Desliza <i /></span>
					</div>
				</section>

				{/* ─── IDENTIDAD ─── */}
				<section className="kb-id" data-reveal>
					<div className="kb-id-avatar"><img src={cld(AVATAR, "f_auto,q_auto,w_200")} alt="" /></div>
					<div className="kb-id-text">
						<strong>@klaudiabrice</strong>
						<span>Modelo · Col / Vzla 📍</span>
					</div>
					<a className="kb-id-cta" href="#booking">Contratar</a>
				</section>
				<div className="kb-stats" data-reveal>
					<div><b>5.3K</b><span>Instagram</span></div>
					<div><b>25.8K</b><span>TikTok</span></div>
					<div><b>114K</b><span>Me gusta</span></div>
				</div>

				{/* ─── TICKER ─── */}
				<div className="kb-ticker" aria-hidden="true">
					<div className="kb-ticker-in">
						{[0, 1].map((k) => (
							<span key={k}>{SERVICES.map((s) => `${s} ✦ `).join("").repeat(3)}</span>
						))}
					</div>
				</div>

				{/* ─── SOBRE MÍ ─── */}
				<section className="kb-sec">
					<SectionHead n="01" title="Sobre mí" note="Un poco de mí" />
					<p className="kb-lead" data-reveal>
						Soy modelo con enfoque en fotografía comercial, editorial y beauty. Me caracterizo por una imagen natural, versátil y una actitud profesional frente a cámara.
					</p>
					<blockquote className="kb-quote" data-reveal>Natural, versátil y profesional frente a cámara.</blockquote>
					<p className="kb-body" data-reveal>
						Me adapto fácilmente a diferentes conceptos y estilos, manteniendo siempre compromiso, puntualidad y disposición para el trabajo en equipo. Busco oportunidades de crecimiento dentro de la industria del modelaje y colaboraciones que potencien mi desarrollo profesional.
					</p>
					<div className="kb-tags" data-reveal>
						{SERVICES.map((s) => <span key={s}>{s}</span>)}
					</div>
				</section>

				{/* ─── COMP CARD ─── */}
				<section className="kb-sec" ref={specsRef}>
					<SectionHead n="02" title="Comp card" note="Medidas" />
					<div className="kb-specs">
						<div className="kb-spec wide" data-reveal>
							<small>Estatura</small>
							<p><b>{(height / 100).toFixed(2).replace(".", ",")}</b><span>m</span></p>
							<div className="kb-ruler"><i style={{ width: `${(height / 200) * 100}%` }} /></div>
						</div>
						<div className="kb-spec wide" data-reveal>
							<small>Medidas</small>
							<div className="kb-measures">
								<div><b>{bust}</b><span>Busto</span></div>
								<i>/</i>
								<div><b>{waist}</b><span>Cintura</span></div>
								<i>/</i>
								<div><b>{hip}</b><span>Cadera</span></div>
							</div>
						</div>
						<div className="kb-spec" data-reveal style={{ "--d": ".05s" }}>
							<small>Peso</small>
							<p><b>{weight}</b><span>kg</span></p>
						</div>
						<div className="kb-spec" data-reveal style={{ "--d": ".1s" }}>
							<small>Calzado</small>
							<p><b>{shoe}</b><span>EU</span></p>
						</div>
						<div className="kb-spec" data-reveal style={{ "--d": ".05s" }}>
							<small>Talla</small>
							<p><b>S</b></p>
						</div>
						<div className="kb-spec" data-reveal style={{ "--d": ".1s" }}>
							<small>Cabello</small>
							<p className="sw"><i style={{ background: "#1b1714" }} /><b>Negro</b></p>
						</div>
						<div className="kb-spec" data-reveal style={{ "--d": ".05s" }}>
							<small>Ojos</small>
							<p className="sw"><i style={{ background: "#a8743a" }} /><b>Miel</b></p>
						</div>
						<div className="kb-spec" data-reveal style={{ "--d": ".1s" }}>
							<small>Tono de piel</small>
							<p className="sw"><i style={{ background: "#c99a76" }} /><b>Trigueña clara</b></p>
						</div>
					</div>
					{COMP_CARD_URL && (
						<a className="kb-btn ghost dark" href={COMP_CARD_URL} target="_blank" rel="noopener noreferrer" data-reveal>
							<Icon name="card" size={18} /> Ver comp card completa
						</a>
					)}
				</section>

				{/* ─── LOOKBOOK ─── */}
				<section className="kb-sec">
					<SectionHead n="03" title="Lookbook" note={`${PHOTOS.length} looks`} />
					<div className="kb-toggle" data-reveal role="tablist">
						<button className={view === "mag" ? "on" : ""} onClick={() => setView("mag")} role="tab" aria-selected={view === "mag"}>Revista</button>
						<button className={view === "sheet" ? "on" : ""} onClick={() => setView("sheet")} role="tab" aria-selected={view === "sheet"}>Contact sheet</button>
					</div>

					{view === "mag" ? (
						<div className="kb-mag">
							{PHOTOS.map((p, i) => {
								const lay = layoutFor(i, PHOTOS.length);
								const headline = lay === "full" ? HEADLINES[fullCount++ % HEADLINES.length] : null;
								return (
									<button key={p} className={`kb-mag-item ${lay}`} data-reveal onClick={() => setLb(i)} aria-label={`Ver look ${i + 1}`}>
										<img src={cld(p, lay === "small" ? "f_auto,q_auto,w_500" : "f_auto,q_auto,w_900")} alt="" loading="lazy" draggable={false} />
										{headline && <span className="kb-mag-headline">{headline}</span>}
										<span className="kb-mag-cap"><i>N° {pad(i + 1)}</i><em>Ver ↗</em></span>
									</button>
								);
							})}
						</div>
					) : (
						<div className="kb-sheet">
							<div className="kb-sheet-head"><span>KB 400</span><span>Roll 01</span><span>{PHOTOS.length} EXP</span></div>
							<div className="kb-sheet-grid">
								{PHOTOS.map((p, i) => (
									<button key={p} className="kb-frame" data-reveal style={{ "--d": `${(i % 3) * 0.06}s` }} onClick={() => setLb(i)} aria-label={`Ver look ${i + 1}`}>
										<span className="kb-frame-img"><img src={cld(p, "f_auto,q_auto,w_400")} alt="" loading="lazy" draggable={false} /></span>
										<span className="kb-frame-label"><b>{pad(i + 1)}A</b><i>▸ {pad(i + 2)}</i></span>
									</button>
								))}
							</div>
						</div>
					)}
				</section>

				{/* ─── REDES ─── */}
				<section className="kb-sec">
					<SectionHead n="05" title="Redes & contacto" />
					<nav className="kb-links">
						<a className="kb-link" href={IG_URL} target="_blank" rel="noopener noreferrer" data-reveal>
							<span className="kb-link-n">01</span>
							<span className="kb-link-text"><small>Instagram</small><strong>@klaudiabrice</strong><em>Portfolio diario · 5.3K seguidores</em></span>
							<span className="kb-link-go"><Icon name="instagram" size={18} /></span>
						</a>
						<a className="kb-link" href={TT_URL} target="_blank" rel="noopener noreferrer" data-reveal>
							<span className="kb-link-n">02</span>
							<span className="kb-link-text">
								<small>TikTok <span className="kb-live"><i />LIVE todos los días</span></small>
								<strong>@klaudiabrice</strong>
								<em>25.8K seguidores · 114K me gusta</em>
							</span>
							<span className="kb-link-go"><Icon name="tiktok" size={18} /></span>
						</a>
						<a className="kb-link" href={BOOKING_MAIL} data-reveal>
							<span className="kb-link-n">03</span>
							<span className="kb-link-text"><small>Booking & prensa</small><strong>{EMAIL}</strong><em>Campañas, editoriales, catálogo y pasarela</em></span>
							<span className="kb-link-go"><Icon name="mail" size={18} /></span>
						</a>
					</nav>
				</section>

				{/* ─── BOOKING ─── */}
				<section className="kb-book" id="booking">
					<p className="kb-book-kicker" data-reveal>Disponible para trabajar · Abierta a viajar</p>
					<h2 data-reveal>¿Creamos algo <i>juntos?</i></h2>
					<ul className="kb-book-list" data-reveal>
						{SERVICES.map((s) => <li key={s}>{s}</li>)}
					</ul>
					<div className="kb-book-actions">
						<a className="kb-btn light" href={BOOKING_MAIL} data-reveal><Icon name="mail" size={18} /> Escribir para booking</a>
						<button className="kb-btn ghost" onClick={saveContact} data-reveal><Icon name="user" size={18} /> Guardar contacto</button>
						<button className="kb-btn ghost" onClick={copyEmail} data-reveal><Icon name="copy" size={18} /> Copiar email</button>
					</div>
				</section>

				<footer className="kb-foot">
					<span>Klaudia Briceño © {new Date().getFullYear()}</span>
					<span>Portfolio N° 01</span>
				</footer>
			</main>

			{lb !== null && <Lightbox start={lb} onClose={closeLb} />}
			{toast && <div className="kb-toast">{toast}</div>}
		</div>
	);
};

export default Home;