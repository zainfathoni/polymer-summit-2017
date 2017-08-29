const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      background-color: red;
      position: relative;
      background-size: 100% 100%;
    }
    img {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  </style>
`;

const io = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.setAttribute("full", "");
    }
  }
});

class SCImg extends HTMLElement {
  static get observedAttributes() {
    return ["full"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    io.observe(this);
  }

  disconnectedCallback() {
    io.unobserve(this);
  }

  get full() {
    return this.hasAttribute("full");
  }

  get src() {
    return this.getAttribute("src");
  }

  attributeChangedCallback() {
    if (this.loaded) return;
    const img = document.createElement("img");
    img.src = this.src;
    img.onload = _ => {
      this.loaded = true;
      this.shadowRoot.appendChild(img);
    };
  }
}

customElements.define("sc-img", SCImg);
