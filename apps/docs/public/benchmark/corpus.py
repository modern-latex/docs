import random
import sys
from pathlib import Path

folder = Path(sys.argv[1])
folder.mkdir(parents=True, exist_ok=True)

words = """the of a model which each value system time result method data order case point set
function space field form under given between measure linear structure process theory
sequence boundary energy rate signal sample error bound proof estimate graph network
layer operator matrix vector state input output weight class group ring map image
kernel flow surface curve angle length area volume density pressure stable small large
first second final general special local global finite infinite discrete continuous
simple complex random uniform normal mean variance spectral dual inverse optimal""".split()


def prose(chance, count):
    sentences = []
    for _ in range(count):
        length = chance.randint(9, 22)
        line = " ".join(chance.choice(words) for _ in range(length))
        sentences.append(line[0].upper() + line[1:] + ".")
    return " ".join(sentences)


def paragraphs(chance, count, span=(4, 8)):
    return "\n\n".join(prose(chance, chance.randint(*span)) for _ in range(count))


def write(name, text):
    Path(folder, name).write_text(text, encoding="utf-8", newline="\n")


preamble = """#set page(paper: "us-letter", margin: 2.5cm, numbering: "1")
#set text(font: "New Computer Modern", size: 11pt)
#set par(justify: true, first-line-indent: 1.5em, spacing: 0.65em, leading: 0.6em)
#show math.equation: set text(font: "New Computer Modern Math")
"""

write("startup.tex", r"""\documentclass{article}
\begin{document}
Hello, world. This is the smallest document the benchmark sets.
\end{document}
""")
write("startup.typ", """#set page(paper: "us-letter", numbering: "1")
#set text(font: "New Computer Modern", size: 10pt)
Hello, world. This is the smallest document the benchmark sets.
""")

chance = random.Random(2)
latex, typst = [], []
for section in range(1, 9):
    previous = max(1, section - 1)
    text = paragraphs(chance, 3)
    first, second = chance.choice(words), chance.choice(words)
    note = prose(chance, 1)
    bullets = [prose(chance, 1) for _ in range(4)]
    details = paragraphs(chance, 2)
    numbered = [prose(chance, 1) for _ in range(3)]
    latex.append(f"\\section{{Section {section}}}\\label{{sec:{section}}}\n")
    latex.append(text)
    latex.append(f"\n\nAs Section~\\ref{{sec:{previous}}} shows on page~\\pageref{{sec:{previous}}}, "
                 f"the {first} is {second}.\\footnote{{{note}}}\n")
    latex.append("\\begin{itemize}\n" + "".join(f"  \\item {bullet}\n" for bullet in bullets) + "\\end{itemize}\n")
    latex.append(f"\\subsection{{Details of part {section}}}\n" + details + "\n")
    latex.append("\\begin{enumerate}\n" + "".join(f"  \\item {step}\n" for step in numbered) + "\\end{enumerate}\n")
    typst.append(f"= Section {section} <sec:{section}>\n\n{text}\n\n"
                 f"As #ref(<sec:{previous}>) shows on #ref(<sec:{previous}>, form: \"page\"), the {first} is {second}.#footnote[{note}]\n\n"
                 + "".join(f"- {bullet}\n" for bullet in bullets)
                 + f"\n== Details of part {section}\n\n{details}\n\n"
                 + "".join(f"+ {step}\n" for step in numbered))
abstract = prose(chance, 5)
write("structure.tex", r"""\documentclass[11pt]{article}
\usepackage[margin=2.5cm]{geometry}
\usepackage{hyperref}
\title{Document Structure}
\author{The Benchmark}
\date{15 October 2026}
\begin{document}
\maketitle
\begin{abstract}
""" + abstract + r"""
\end{abstract}
\tableofcontents
""" + "\n".join(latex) + "\n\\end{document}\n")
write("structure.typ", preamble + """#set heading(numbering: "1.1")
#set document(title: "Document Structure", author: "The Benchmark")

#align(center)[
  #text(17pt)[Document Structure]
  #v(0.6em)
  #text(12pt)[The Benchmark]
  #v(0.4em)
  #text(12pt)[15 October 2026]
]

#align(center)[*Abstract*]
#pad(x: 2.5em)[#set text(10pt); """ + abstract + """]

#outline()

""" + "\n".join(typst))

chance = random.Random(3)
latex, typst = [], []
for number in range(1, 25):
    text = paragraphs(chance, 1)
    latex.append(text)
    typst.append(text)
    kind = number % 6
    if kind == 0:
        latex.append(f"\\begin{{equation}}\\label{{eq:{number}}}\n  \\int_0^\\infty e^{{-{number}x^2}}\\,dx = \\frac{{\\sqrt{{\\pi}}}}{{2\\sqrt{{{number}}}}}\n\\end{{equation}}")
        typst.append(f"$ integral_0^infinity e^(-{number} x^2) dif x = sqrt(pi) / (2 sqrt({number})) $ <eq:{number}>")
    elif kind == 1:
        latex.append(f"\\begin{{align}}\n  f_{{{number}}}(x) &= \\sum_{{k=0}}^{{n}} \\binom{{n}}{{k}} x^k (1-x)^{{n-k}} \\\\\n"
                     f"  g_{{{number}}}(x) &= \\prod_{{j=1}}^{{m}} \\left(1 + \\frac{{x}}{{j^2}}\\right)\\label{{eq:{number}}}\n\\end{{align}}")
        typst.append(f"$ f_({number})(x) &= sum_(k=0)^n binom(n, k) x^k (1-x)^(n-k) \\\n"
                     f"  g_({number})(x) &= product_(j=1)^m (1 + x / j^2) $ <eq:{number}>")
    elif kind == 2:
        latex.append(f"\\begin{{equation}}\\label{{eq:{number}}}\n  A_{{{number}}} = \\begin{{pmatrix}} a_{{11}} & a_{{12}} & \\cdots & a_{{1n}} \\\\ "
                     "a_{21} & a_{22} & \\cdots & a_{2n} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ "
                     "a_{m1} & a_{m2} & \\cdots & a_{mn} \\end{pmatrix}\n\\end{equation}")
        typst.append(f"$ A_({number}) = mat(a_(11), a_(12), dots.c, a_(1n); a_(21), a_(22), dots.c, a_(2n); "
                     f"dots.v, dots.v, dots.down, dots.v; a_(m 1), a_(m 2), dots.c, a_(m n)) $ <eq:{number}>")
    elif kind == 3:
        proof = prose(chance, 2)
        latex.append(f"\\begin{{theorem}}\\label{{thm:{number}}}\nFor every $\\varepsilon > 0$ there is $\\delta > 0$ with "
                     f"$\\lvert f(x) - f(y) \\rvert < \\varepsilon$ whenever $\\lVert x - y \\rVert < \\delta$.\n\\end{{theorem}}\n"
                     "\\begin{proof}\n" + proof + " Hence $\\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}$.\n\\end{proof}")
        typst.append(f"#theorem[For every $epsilon > 0$ there is $delta > 0$ with "
                     f"$abs(f(x) - f(y)) < epsilon$ whenever $norm(x - y) < delta$.] <thm:{number}>\n\n"
                     f"#proof[{proof} Hence $sum_(n=1)^infinity 1 / n^2 = pi^2 / 6$.]")
    elif kind == 4:
        latex.append(f"\\begin{{equation}}\\label{{eq:{number}}}\n  \\lvert x \\rvert = \\begin{{cases}} x & \\text{{if }} x \\ge 0, \\\\ -x & \\text{{otherwise.}} \\end{{cases}}\n\\end{{equation}}")
        typst.append(f"$ abs(x) = cases(x & \"if\" x >= 0 \\,, -x & \"otherwise.\") $ <eq:{number}>")
    else:
        latex.append(f"\\begin{{gather}}\n  \\nabla \\cdot \\mathbf{{E}} = \\frac{{\\rho}}{{\\varepsilon_0}}, \\qquad "
                     f"\\nabla \\times \\mathbf{{B}} - \\mu_0\\varepsilon_0 \\frac{{\\partial \\mathbf{{E}}}}{{\\partial t}} = \\mu_0 \\mathbf{{J}}\\label{{eq:{number}}}\n\\end{{gather}}")
        typst.append(f"$ nabla dot bold(E) = rho / epsilon_0, quad "
                     f"nabla times bold(B) - mu_0 epsilon_0 (partial bold(E)) / (partial t) = mu_0 bold(J) $ <eq:{number}>")
    if number > 1:
        target = number - 1 if (number - 1) % 6 != 3 else number - 2
        latex.append(f"By \\eqref{{eq:{target}}} the claim follows, with $\\alpha_{{{number}}} \\in \\mathbb{{R}}^n$.")
        typst.append(f"By #ref(<eq:{target}>, supplement: none) the claim follows, with $alpha_({number}) in RR^n$.")
write("expressions.tex", r"""\documentclass[11pt]{article}
\usepackage[margin=2.5cm]{geometry}
\usepackage{amsmath,amssymb,amsthm}
\newtheorem{theorem}{Theorem}
\begin{document}
\section*{Expressions}
""" + "\n\n".join(latex) + "\n\\end{document}\n")
write("expressions.typ", preamble + """#set math.equation(numbering: "(1)")

// amsthm's theorem and proof, as LaTeX sets them.
#let theorems = counter("theorem")
#let theorem(body) = block(width: 100%)[
  #theorems.step()
  *Theorem #context theorems.display().* #emph(body)
]
#let proof(body) = block(width: 100%)[_Proof._ #body #h(1fr) $square$]

#heading(numbering: none)[Expressions]

""" + "\n\n".join(typst) + "\n")

chance = random.Random(4)
items = [(number, chance.choice(words), chance.choice(words), chance.randint(10, 999), f"{chance.random() * 100:.2f}", f"{chance.random():.3f}")
         for number in range(1, 121)]
listing = "\n".join(f"  {number} & {first} {second} & {count} & {value} & {share} \\\\" for number, first, second, count, value, share in items)
floats, figures = [], []
for trial in range(1, 7):
    cells = [(chance.choice(words).capitalize(), chance.randint(1, 99), chance.randint(1, 99), f"{chance.random():.2f}") for _ in range(6)]
    lines = "\n".join(f"  {name} & {runs} & {passes} & {ratio} \\\\" for name, runs, passes, ratio in cells)
    text = paragraphs(chance, 1)
    floats.append(r"""\begin{table}[h]
\centering
\caption{Results of trial """ + str(trial) + r"""}
\begin{tabular}{lrrr}
\toprule
Name & Runs & Passes & Ratio \\
\midrule
""" + lines + r"""
\bottomrule
\end{tabular}
\end{table}
""" + text)
    figures.append(f"""#figure(
  caption: [Results of trial {trial}],
  table(
    columns: 4,
    align: (left, right, right, right),
    table.hline(stroke: 0.8pt),
    table.header[Name][Runs][Passes][Ratio],
    table.hline(stroke: 0.5pt),
""" + "".join(f"    [{name}], [{runs}], [{passes}], [{ratio}],\n" for name, runs, passes, ratio in cells) + """    table.hline(stroke: 0.8pt),
  ),
)

""" + text)
intro = paragraphs(chance, 1)
groups = [(chance.choice(words).capitalize(), prose(chance, 1), chance.randint(1, 500)) for _ in range(8)]
write("tabular.tex", r"""\documentclass[11pt]{article}
\usepackage[margin=2.5cm]{geometry}
\usepackage{booktabs,tabularx,multirow,longtable}
\begin{document}
\section*{Tabular}
""" + intro + "\n\n" + "\n\n".join(floats) + r"""

\begin{tabularx}{\textwidth}{lXr}
\toprule
\multirow{2}{*}{Group} & Description & Total \\
 & of the group & \\
\midrule
""" + "\n".join(f"{group} & {description} & {total} \\\\" for group, description, total in groups) + r"""
\bottomrule
\end{tabularx}

\begin{longtable}{rlrrr}
\caption{A long table across pages}\\
\toprule
No. & Item & Count & Value & Share \\
\midrule
\endfirsthead
\toprule
No. & Item & Count & Value & Share \\
\midrule
\endhead
\bottomrule
\endfoot
""" + listing + r"""
\end{longtable}
\end{document}
""")
write("tabular.typ", preamble + """// booktabs' rules, captions above, and tables allowed to break across pages.
#set table(stroke: none, inset: (x: 6pt, y: 3pt))
#show figure.where(kind: table): set figure.caption(position: top)
#show figure: set block(breakable: true)

#heading(numbering: none)[Tabular]

""" + intro + "\n\n" + "\n\n".join(figures) + """

#table(
  columns: (auto, 1fr, auto),
  align: (left, left, right),
  table.hline(stroke: 0.8pt),
  table.cell(rowspan: 2, align: horizon)[Group], [Description], [Total],
  [of the group], [],
  table.hline(stroke: 0.5pt),
""" + "".join(f"  [{group}], [{description}], [{total}],\n" for group, description, total in groups) + """  table.hline(stroke: 0.8pt),
)

#figure(
  caption: [A long table across pages],
  table(
    columns: 5,
    align: (right, left, right, right, right),
    table.header(
      repeat: true,
      table.hline(stroke: 0.8pt),
      [No.], [Item], [Count], [Value], [Share],
      table.hline(stroke: 0.5pt),
    ),
""" + "".join(f"    [{number}], [{first} {second}], [{count}], [{value}], [{share}],\n" for number, first, second, count, value, share in items) + """    table.hline(stroke: 0.8pt),
  ),
)
""")

chance = random.Random(5)
latex, typst = [], []
for picture in range(1, 7):
    nodes = "\n".join(f"  \\node[draw, rounded corners, fill=blue!{10 * step}] (n{step}) at ({2.2 * step},{(step % 2) * 1.2}) {{Step {step}}};" for step in range(1, 6))
    edges = "\n".join(f"  \\draw[->, thick] (n{step}) -- (n{step + 1});" for step in range(1, 5))
    text = paragraphs(chance, 1)
    latex.append(r"""\begin{center}
\begin{tikzpicture}
""" + nodes + "\n" + edges + r"""
\end{tikzpicture}
\end{center}
""" + text)
    latex.append(r"""\begin{center}
\begin{tikzpicture}[scale=1.2]
  \draw[step=0.5, gray!40, very thin] (-2,-2) grid (2,2);
  \draw[->] (-2.2,0) -- (2.2,0) node[right] {$x$};
  \draw[->] (0,-2.2) -- (0,2.2) node[above] {$y$};
  \draw[red, thick, domain=-2:2, samples=60] plot (\x, {sin(\x r * """ + str(picture) + r""")});
  \draw[blue, thick] (0,0) circle (""" + f"{0.5 + picture * 0.2:.1f}" + r""");
  \fill[green!60!black] (1,1) circle (2pt) node[above right] {$P_{""" + str(picture) + r"""}$};
\end{tikzpicture}
\end{center}
""")
    typst.append(f"#align(center, flow())\n\n{text}\n\n#align(center, field({picture}, {0.5 + picture * 0.2:.1f}))")
axes = "\n".join(r"""\begin{center}
\begin{tikzpicture}
\begin{axis}[width=10cm, height=6cm, xlabel={$x$}, ylabel={$f(x)$}, grid=major, legend pos=north west]
  \addplot[blue, thick, domain=0:4, samples=80] {x^2 / """ + str(axis) + r"""};
  \addplot[red, thick, domain=0:4, samples=80] {exp(x / """ + str(axis + 1) + r""")};
  \legend{quadratic, exponential}
\end{axis}
\end{tikzpicture}
\end{center}
""" for axis in range(1, 4))
write("graphics.tex", r"""\documentclass[11pt]{article}
\usepackage[margin=2.5cm]{geometry}
\usepackage{tikz}
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}
\begin{document}
\section*{Graphics}
""" + "\n".join(latex) + "\n" + axes + "\n\\end{document}\n")
write("graphics.typ", preamble + """// xcolor's blue, red and green!60!black, purer than Typst's own.
#let blue = rgb(0, 0, 255)
#let red = rgb(255, 0, 0)
#let green = rgb(0, 153, 0)

// TikZ's \\draw[->]: a line and a filled arrowhead.
#let arrow(from, to, paint: black, width: 0.8pt) = {
  let angle = calc.atan2(to.at(0).cm() - from.at(0).cm(), to.at(1).cm() - from.at(1).cm())
  let tip(a, r) = (to.at(0) + r * calc.cos(a), to.at(1) + r * calc.sin(a))
  place(line(start: from, end: to, stroke: paint + width))
  place(polygon(fill: paint, to, tip(angle + 155deg, 0.22cm), tip(angle - 155deg, 0.22cm)))
}

// Five rounded steps joined by arrows, as the flowchart's \\node and \\draw.
#let flow() = box(width: 12.4cm, height: 2.2cm, {
  for k in range(1, 6) {
    let x = 2.2cm * k - 2.2cm
    let y = if calc.rem(k, 2) == 1 { 0.2cm } else { 1.4cm }
    place(dx: x, dy: y, box(width: 1.5cm, height: 0.6cm, radius: 3pt, stroke: 0.4pt,
      fill: blue.lighten(100% - 10% * k), align(center + horizon)[Step #k]))
    if k < 5 {
      let y2 = if calc.rem(k + 1, 2) == 1 { 0.2cm } else { 1.4cm }
      arrow((x + 1.5cm, y + 0.3cm), (x + 2.2cm, y2 + 0.3cm), width: 0.8pt)
    }
  }
})

// The grid, the axes, sin(px), a circle and a point, at TikZ's scale 1.2.
#let field(p, r) = box(width: 6cm, height: 6cm, {
  let s = 1.2cm
  let at(x, y) = (3cm + x * s, 3cm - y * s)
  for k in range(0, 9) {
    let v = -2 + k * 0.5
    place(line(start: at(v, -2), end: at(v, 2), stroke: gray.lighten(60%) + 0.2pt))
    place(line(start: at(-2, v), end: at(2, v), stroke: gray.lighten(60%) + 0.2pt))
  }
  arrow(at(-2.2, 0), at(2.2, 0), width: 0.4pt)
  arrow(at(0, -2.2), at(0, 2.2), width: 0.4pt)
  place(dx: 3cm + 2.3 * s, dy: 2.8cm, $x$)
  place(dx: 2.9cm, dy: 3cm - 2.6 * s, $y$)
  let points = range(0, 61).map(n => {
    let x = -2 + n * 4 / 60
    at(x, calc.sin(x * p))
  })
  place(curve(stroke: red + 0.8pt, curve.move(points.first()), ..points.slice(1).map(q => curve.line(q))))
  place(dx: 3cm - r * s, dy: 3cm - r * s, circle(radius: r * s, stroke: blue + 0.8pt))
  place(dx: 3cm + s - 2pt, dy: 3cm - s - 2pt, circle(radius: 2pt, fill: green))
  place(dx: 3cm + s + 3pt, dy: 3cm - s - 14pt, $P_#p$)
})

// pgfplots' axis: a framed 10 cm by 6 cm box, a major grid, two curves and a legend.
#let axis(k) = box(width: 10cm, height: 6.6cm, {
  let w = 8.4cm
  let h = 5cm
  let ox = 1.2cm
  let f(x) = x * x / k
  let g(x) = calc.exp(x / (k + 1))
  let top = calc.max(f(4), g(4))
  let step = if top <= 5 { 1 } else if top <= 10 { 2 } else { 5 }
  let ymax = calc.ceil(top / step) * step
  let at(x, y) = (ox + x / 4 * w, h - y / ymax * h)
  for t in range(0, 5) {
    place(line(start: at(t, 0), end: at(t, ymax), stroke: gray.lighten(60%) + 0.3pt))
    place(dx: ox + t / 4 * w - 3pt, dy: h + 4pt, text(9pt)[#t])
  }
  for n in range(0, int(ymax / step) + 1) {
    let y = n * step
    place(line(start: at(0, y), end: at(4, y), stroke: gray.lighten(60%) + 0.3pt))
    place(dx: ox - 14pt, dy: h - y / ymax * h - 5pt, text(9pt)[#y])
  }
  place(dx: ox, rect(width: w, height: h, stroke: 0.5pt))
  let plot(fn, paint) = {
    let points = range(0, 80).map(n => at(n * 4 / 79, fn(n * 4 / 79)))
    place(curve(stroke: paint + 0.8pt, curve.move(points.first()), ..points.slice(1).map(q => curve.line(q))))
  }
  plot(f, blue)
  plot(g, red)
  place(dx: ox + w / 2, dy: h + 18pt, $x$)
  place(dx: 0pt, dy: h / 2, $f(x)$)
  place(dx: ox + 6pt, dy: 6pt, box(stroke: 0.4pt, fill: white, inset: 4pt, text(9pt)[
    #box(line(length: 0.5cm, stroke: blue + 0.8pt)) quadratic \\
    #box(line(length: 0.5cm, stroke: red + 0.8pt)) exponential
  ]))
})

#heading(numbering: none)[Graphics]

""" + "\n\n".join(typst) + "\n\n" + "\n\n".join(f"#align(center, axis({axis}))" for axis in range(1, 4)) + "\n")

chance = random.Random(6)
surnames = "Knuth Lamport Turing Hopper Dijkstra Lovelace Shannon Gauss Euler Noether Hilbert Riemann Cauchy Fourier Laplace Kolmogorov".split()
entries = []
for number in range(1, 41):
    first = chance.choice(surnames)
    second = chance.choice(surnames)
    entries.append(f"""@article{{ref{number},
  author  = {{{first}, A. and {second}, B.}},
  title   = {{On the {chance.choice(words)} {chance.choice(words)} of {chance.choice(words)} {chance.choice(words)}s}},
  journal = {{Journal of {chance.choice(words).capitalize()} Studies}},
  volume  = {{{chance.randint(1, 60)}}},
  pages   = {{{chance.randint(1, 400)}--{chance.randint(401, 800)}}},
  year    = {{{chance.randint(1950, 2025)}}}
}}""")
write("references.bib", "\n\n".join(entries) + "\n")
latex, typst = [], []
for number in range(1, 41):
    text = prose(chance, 3)
    later = (number * 7) % 40 + 1
    latex.append(text + f" This was shown by \\citet{{ref{number}}} and later \\citep{{ref{later}}}.")
    typst.append(text + f" This was shown by #cite(<ref{number}>, form: \"prose\") and later #cite(<ref{later}>).")
write("citations.tex", r"""\documentclass[11pt]{article}
\usepackage[margin=2.5cm]{geometry}
\usepackage{natbib}
\begin{document}
\section*{Citations}
""" + "\n\n".join(latex) + r"""

\bibliographystyle{plainnat}
\bibliography{references}
\end{document}
""")
write("citations.typ", preamble + """
#heading(numbering: none)[Citations]

""" + "\n\n".join(typst) + """

#bibliography("references.bib", title: "References", style: "chicago-author-date")
""")

chance = random.Random(7)
latex, typst = [], []
for chapter in range(1, 13):
    opening = paragraphs(chance, 4, (6, 10))
    parts = [f"\\chapter{{Chapter {chapter}}}\\label{{ch:{chapter}}}", opening]
    pieces = [f"= Chapter {chapter} <ch:{chapter}>", opening]
    for section in range(1, 5):
        body = paragraphs(chance, 3, (6, 10))
        note = prose(chance, 1)
        after = paragraphs(chance, 2, (6, 10))
        previous, prior = max(1, chapter - 1), max(1, section - 1)
        parts.append(f"\\section{{Topic {chapter}.{section}}}\\label{{sec:{chapter}.{section}}}")
        parts.append(body)
        parts.append(f"See Chapter~\\ref{{ch:{previous}}} and Section~\\ref{{sec:{chapter}.{prior}}}.\\footnote{{{note}}}")
        parts.append(f"\\begin{{equation}}\\label{{eq:{chapter}.{section}}} E_{{{chapter}{section}}} = \\sum_{{i=1}}^{{N}} \\frac{{p_i^2}}{{2m}} + V(x_i)\\end{{equation}}")
        parts.append(after)
        pieces.append(f"== Topic {chapter}.{section} <sec:{chapter}.{section}>")
        pieces.append(body)
        pieces.append(f"See #ref(<ch:{previous}>, supplement: [Chapter]) and #ref(<sec:{chapter}.{prior}>).#footnote[{note}]")
        pieces.append(f"$ E_({chapter}{section}) = sum_(i=1)^N p_i^2 / (2m) + V(x_i) $ <eq:{chapter}.{section}>")
        pieces.append(after)
    latex.append("\n\n".join(parts))
    typst.append("\n\n".join(pieces))
write("monograph.tex", r"""\documentclass[11pt]{report}
\usepackage{amsmath}
\title{The Benchmark Monograph}
\author{The Benchmark}
\date{15 October 2026}
\begin{document}
\maketitle
\tableofcontents
""" + "\n\n".join(latex) + "\n\\end{document}\n")
write("monograph.typ", """// LaTeX's report: US letter with its default margins, chapters on new pages.
#set page(paper: "us-letter", margin: (x: 1.75in, top: 1.5in, bottom: 1.6in), numbering: "1")
#set text(font: "New Computer Modern", size: 11pt)
#set par(justify: true, first-line-indent: 1.5em, spacing: 0.65em, leading: 0.6em)
#show math.equation: set text(font: "New Computer Modern Math")
#set heading(numbering: "1.1")
#set math.equation(numbering: "(1)")
#show heading.where(level: 1): it => {
  pagebreak(weak: true)
  v(3em)
  text(20pt, weight: "bold")[Chapter #counter(heading).display()]
  v(1em)
  text(24pt, weight: "bold", it.body)
  v(2em)
}

#page(numbering: none, align(center + horizon)[
  #text(17pt)[The Benchmark Monograph]
  #v(1em)
  #text(12pt)[The Benchmark]
  #v(0.6em)
  #text(12pt)[15 October 2026]
])

#outline()

""" + "\n\n".join(typst) + "\n")

print("\n".join(sorted(path.name for path in folder.iterdir())))
