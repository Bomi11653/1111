import type { WorkCatalogEntry } from "@/data/worksCatalog";

const ARK_BASE = "/works/blender-ark";
const ICE_BASE = "/works/bing-suo-han-chuan";

export const worksCatalogEn: WorkCatalogEntry[] = [
  {
    slug: "blender-ark",
    title: "Ark",
    subtitle: "Sci-fi Concept · Seeding Initiative · Ark-7",
    tagline: "A sanctuary for life and civilization",
    summary:
      "Ark-7 is the seventh vessel—and the first designed as a permanent home—under the Seeding Initiative: a mobile, self-sufficient ecological city rendered at industrial scale with layered narrative space for interstellar pioneers.",
    year: "2025",
    role: "Environment Artist · Solo",
    tools: ["Blender", "Adobe After Effects 2025", "Photoshop"],
    tags: ["Sci-fi Concept", "Blender", "Game Environment", "Ark-7"],
    cover: `${ARK_BASE}/cover.jpg`,
    gallery: [
      { file: "01.jpg", alt: "Ark · Hero view", caption: "Ark-7 orbital render · planet and station" },
      { file: "02.jpg", alt: "Ark · Structure breakdown", caption: "Module zones · agriculture / habitation / water / engine" },
      { file: "03.jpg", alt: "Ark · Worldbuilding", caption: "Lore and history · Seeding Initiative" },
      { file: "04.jpg", alt: "Ark · Production pipeline", caption: "Wireframe · blockout · materials · final render" },
      { file: "05.jpg", alt: "Ark · Mood frames", caption: "Nine-frame cinematic selection" },
      { file: "06.jpg", alt: "Ark · References", caption: "Concept and form references" },
    ],
    stagePosters: [
      { file: "posters/poster-01.jpg", alt: "Ark · Triptych poster" },
      { file: "posters/poster-02.jpg", alt: "Ark · Vertical structure" },
      { file: "posters/poster-03.jpg", alt: "Ark · Narrative poster" },
    ],
    meta: {
      category: "Sci-fi Concept",
      durationWeeks: 4,
      solo: true,
      ggacUrl: "https://www.ggac.com/work/detail/1829377",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: "Type: sci-fi concept game environment. Duration: 4 weeks, solo. Ark-7 is not a conventional explorer or warship—it is a next-generation ark under the Seeding Initiative, built to drift as a mobile ecological city in search of colonizable worlds.",
        media: [
          { type: "image", src: `${ARK_BASE}/01.jpg`, alt: "Ark · Hero view", caption: "Hero render · Ark-7 and planet" },
          { type: "image", src: `${ARK_BASE}/02.jpg`, alt: "Ark · Structure breakdown" },
        ],
      },
      {
        id: "world",
        title: "Worldbuilding & History",
        body: "In Earth's late era, a global coalition launched the Seeding Initiative, dispatching arks carrying knowledge, gene banks, culture, and technology. Ark-1 through Ark-6 were early prototypes; Ark-7 is the culmination—the first true permanent home, with onboard society structured like a self-governing city-state.",
        media: [{ type: "image", src: `${ARK_BASE}/03.jpg`, alt: "Ark · Worldbuilding" }],
      },
      {
        id: "structure",
        title: "Modules & Structure",
        body: "The scene divides into agricultural domes, habitation domes, water recycling, and STL engines. Habitation layers blend greenery with holographic sky; agricultural tiers simulate day/night cycles; the Curator AI subsystem manages light, temperature, and air quality.",
        media: [{ type: "image", src: `${ARK_BASE}/05.jpg`, alt: "Ark · Mood frames" }],
      },
      {
        id: "pipeline",
        title: "Production Pipeline",
        body: "Blender for layout, hard-surface, and lighting; Photoshop for mood and compositing; After Effects for presentation motion. From wireframe and blockout through materials to final render—balancing poly budget, modular repetition, and near-field detail.",
        media: [
          { type: "image", src: `${ARK_BASE}/04.jpg`, alt: "Ark · Production pipeline" },
          { type: "image", src: `${ARK_BASE}/06.jpg`, alt: "Ark · References" },
        ],
      },
      {
        id: "ggac",
        title: "Full Gallery on GGAC",
        body: "The complete HD gallery and process breakdown are published on GGAC—visit the original page for all images.",
        media: [
          {
            type: "embed",
            url: "https://www.ggac.com/work/detail/1829377",
            caption: "View all Ark images on GGAC",
          },
        ],
      },
    ],
    hueOffset: 0,
    speed: 1.05,
    externalUrl: "https://www.ggac.com/work/detail/1829377",
    featured: true,
  },
  {
    slug: "bing-suo-han-chuan",
    title: "Ice Lock River",
    subtitle: "Sci-fi Concept · Cold Environment",
    tagline: "Frozen rivers and industrial ruins",
    summary:
      "A sci-fi cold-region environment where frozen rivers and industrial ruins intersect—cold volumetric light and structural silhouettes create a solitary, monumental exploration mood.",
    year: "2025",
    role: "Environment Artist · Solo",
    tools: ["Blender", "Adobe After Effects 2025", "Photoshop"],
    tags: ["Sci-fi Concept", "Blender", "Environmental Storytelling"],
    cover: `${ICE_BASE}/cover.jpg`,
    gallery: [
      { file: "01.jpg", alt: "Ice Lock River · Hero view", caption: "Hero render" },
      { file: "02.jpg", alt: "Ice Lock River · Environment panorama" },
      { file: "03.jpg", alt: "Ice Lock River · Atmosphere" },
      { file: "04.jpg", alt: "Ice Lock River · Lighting" },
      { file: "05.jpg", alt: "Ice Lock River · Structural detail" },
      { file: "06.jpg", alt: "Ice Lock River · Alternate angle" },
    ],
    stagePosters: [],
    meta: {
      category: "Sci-fi Concept",
      durationWeeks: 3,
      solo: true,
      ggacUrl: "https://www.ggac.com/work/detail/1783137",
    },
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: "Type: sci-fi concept environment. Duration: 3 weeks, solo. Built around the theme Ice Lock River—sci-fi ruins and human-made structures in an extreme cold landscape, emphasizing warm/cool contrast, fog layers, and distant readability.",
        media: [
          { type: "image", src: `${ICE_BASE}/01.jpg`, alt: "Ice Lock River · Hero view", caption: "Hero render" },
          { type: "image", src: `${ICE_BASE}/02.jpg`, alt: "Ice Lock River · Environment panorama" },
        ],
      },
      {
        id: "atmosphere",
        title: "Atmosphere & Lighting",
        body: "Key light stays cool (skylight, ice bounce) with localized warm accents (artificial sources, warning signage) as visual anchors. Volumetric fog and desaturated materials reinforce cold-region pressure while preserving dramatic silhouettes.",
        media: [
          { type: "image", src: `${ICE_BASE}/03.jpg`, alt: "Ice Lock River · Atmosphere" },
          { type: "image", src: `${ICE_BASE}/04.jpg`, alt: "Ice Lock River · Lighting" },
        ],
      },
      {
        id: "detail",
        title: "Structure & Detail",
        body: "Terrain massing, frozen river, and main architecture in Blender; Photoshop for color and mood; AE for final showreel edit. Focus on near-field material variation and mid-to-far depth layering.",
        media: [
          { type: "image", src: `${ICE_BASE}/05.jpg`, alt: "Ice Lock River · Structural detail" },
          { type: "image", src: `${ICE_BASE}/06.jpg`, alt: "Ice Lock River · Alternate angle" },
        ],
      },
      {
        id: "ggac",
        title: "Full Gallery on GGAC",
        body: "The complete HD gallery is published on GGAC—visit the original page for all images.",
        media: [
          {
            type: "embed",
            url: "https://www.ggac.com/work/detail/1783137",
            caption: "View all Ice Lock River images on GGAC",
          },
        ],
      },
    ],
    hueOffset: -14,
    speed: 0.82,
    externalUrl: "https://www.ggac.com/work/detail/1783137",
    featured: true,
  },
];
