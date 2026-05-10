
# AfriBrand AI - Strategic Marketing for African SMEs

AfriBrand AI is a professional SaaS marketing platform designed to empower African SMEs by generating on-brand social media assets and campaigns using advanced Generative AI (Google Gemini 2.5/3). The platform focuses on deep cultural localization, low-bandwidth optimization, and mobile-first experiences.

**AfriBrand AI — Property of Malthus AMETEPE**

## Implemented Features

### Brand Strategy and Analysis
- Brand DNA Extraction: Automated module to extract primary and secondary color palettes, typography, tone of voice, and cultural context from business descriptions or URLs.
- Brand Guidelines Management: Centralized storage for logos, custom fonts, and brand assets to ensure consistency across all generated content.
- SME Strategic Insights: Industry-specific recommendations tailored for the African market, focusing on regional consumer behavior.

### Campaign Planning
- Automated Campaign Planner: Generates 30-day marketing strategies with localized cultural hooks based on regional festivals and commercial trends.
- Custom Campaign Generator: Allows users to specify specific events or goals to generate bespoke strategy documents.
- Export Capabilities: Supports data export to CSV and ICS formats for integration with external calendar applications.

### Creative Studio and Asset Generation
- Multi-Platform Asset Generator: Supports Instagram, TikTok, Facebook, WhatsApp, LinkedIn, and YouTube.
- Format Support: Optimized aspect ratios including 1:1, 9:16, 16:9, 4:5, and 1.91:1.
- AI Creative Studio: Natural language creative environment for generating bespoke assets and refining them through conversational editing.
- Cinematic Video Ads: High-quality video generation with multiple quality modes powered by Gemini Veo.
- Social Previews: Accurate UI overlays for verifying asset appearance on specific social platforms.

### Team and Commerce
- Team Management: Role-based access control (Admin, Editor, Viewer) with invitation systems and centralized activity logs.
- WhatsApp Business Catalog Integration: Synchronization with product catalogs to enable seamless generation of product-focused promotional content.
- Unified Settings: Centralized management for social integrations and team collaboration.

### AI Testing Architecture (Hackathon Deliverable)
- Passmark Integration: Implementation of AI-powered regression testing using natural language user steps.
- Automated Test Suites: Comprehensive coverage of authentication, brand analysis, asset creation, and team collaboration workflows.
- Resilience: Intent-based browser automation that heals automatically with UI changes.

## Deliverables
- Brand DNA and Identity Analysis Module.
- Strategic Campaign Generator with CSV/ICS Export.
- Bespoke Image and Video Generation Suite.
- Platform-Specific Social Previews and Overlays.
- Natural Language Creative Editor.
- Role-Based Team Management and Activity Tracking.
- WhatsApp Business Catalog Synchronization.
- AI Powered Regression Testing System (Passmark + Playwright).

## Roadmap (90 Days)
- **V1.3**: Advanced AI voice script generation and localized speech synthesis.
- **V2.0**: Direct API integration for automated social media posting (Meta, TikTok).
- **V2.1**: Real-time sales performance analytics and AI-driven campaign optimization.
- **Optimization**: Enhancement of low-bandwidth asset previewing for remote regions.

## Technical Specification

### Technology Stack
- **Frontend**: React 19 (ESM), Tailwind CSS.
- **AI Core**: Google Gemini API (@google/genai).
    - gemini-3-pro-preview: Strategic planning and copywriting.
    - gemini-2.5-flash-image: High-speed image generation.
    - veo-3.1-generate: Cinematic video generation.
- **Infrastructure**: High-availability containerized environment.

### Pricing Structure
- **Lite**: 5,000 FCFA / month (Standard assets and campaign planning).
- **Pro**: 15,000 FCFA / month (Unlimited generations, cinematic videos, cultural engine).
- **Enterprise**: Custom solutions for agencies and large organizations.

---
*Built for the digital transformation of African commerce.*

## Full Design Prompt

Conçois et spécifie une plateforme SaaS nommée AfriBrand AI, inspirée des fonctionnalités clés de Pomelli (Google DeepMind) mais entièrement repensée pour le marché africain, destinée aux PME africaines et aux petites agences marketing, en intégrant une localisation culturelle et linguistique ultra-précise, une génération d’assets multiformats (images, vidéos, stories, bannières, carousels, scripts audio) optimisés pour chaque plateforme sociale (WhatsApp Business, Instagram, Facebook, TikTok, LinkedIn, YouTube Shorts) et une expérience utilisateur mobile-first, fluide même sur réseaux instables et compatible avec les paiements locaux (M-Pesa, MTN MoMo, Orange Money, Wave, cartes Verve). La plateforme devra permettre, à partir d’une URL de site web, de profils sociaux ou d’un questionnaire guidé, d’extraire un Business DNA complet (palette de couleurs, polices, ton éditorial, style visuel, références culturelles locales, niveau de formalité, type de clientèle) puis de générer automatiquement des idées de campagnes contextualisées (fêtes locales, saisons, événements sportifs ou religieux, temps forts commerciaux), des assets prêts à publier dans plusieurs styles visuels (naturel, normal/professionnel, animé, manga, 3D-render, illustration, etc.) avec des prévisualisations adaptées à chaque format et à chaque plateforme. Décris et structure un module d’extraction du Business DNA capable d’analyser une URL, du texte ou des profils sociaux pour détecter les couleurs dominantes, la typographie, la personnalité de marque, les éléments culturels (ex. bogolan, kente, boubou, urban Lagos/Abidjan, Nouchi, Naija slang, etc.) et les intégrer dans un profil de marque réutilisable. Spécifie un AssetGenerator qui permet de générer et prévisualiser des assets dans plusieurs formats et ratios adaptés aux plateformes : Instagram (1:1, Stories 9:16), TikTok (9:16), Facebook (1:1, Stories 9:16), LinkedIn (1.91:1), WhatsApp Status (9:16), YouTube Shorts (9:16), avec des icônes et labels clairs pour chaque plateforme dans l’UI, la possibilité de choisir le style de génération (natural, anime, manga, 3d-render, illustration, etc.), et l’envoi de ces paramètres (plateforme, format, style, langue, ton) au service de génération basé sur Google Gemini 2.5/3 (texte + image) et Gemini Veo (vidéo). Étends la génération vidéo pour permettre à l’utilisateur de choisir des ratios vidéo (par ex. 9:16 pour TikTok/Stories/WhatsApp Status, 1:1 pour feed Instagram, 16:9 pour YouTube) ainsi qu’un mode de génération (fast vs high-quality si supporté par l’API), et intègre ces options dans l’interface de l’AssetGenerator. Mets en place un éditeur en langage naturel permettant de modifier les assets via commandes textuelles ou vocales (ex. “rends ce titre plus percutant”, “traduis ce texte en yorùbá / wolof / swahili / pidgin”, “ajoute un motif bogolan en arrière-plan”, “adapte ce post pour une audience ivoirienne”), en gérant la réécriture, la traduction, l’ajustement culturel et le changement de style visuel. Conçois un CampaignPlanner capable de générer des idées de campagnes sur 30 jours en s’appuyant sur le Business DNA, les événements locaux (fêtes religieuses, jours fériés, saisons agricoles, rentrée scolaire, grandes compétitions sportives, etc.) et les plateformes ciblées, avec pour chaque idée : un titre de campagne, un concept, un hook culturel, des suggestions de formats (post, story, vidéo courte, carrousel) et des plateformes recommandées ; implémente dans ce module une fonctionnalité d’export CSV incluant au minimum les champs Campaign Title, Concept, Cultural Hook, Suggested Platforms et un export de calendrier éditorial en formats CSV et ICS, avec des suggestions d’horaires de publication optimaux par pays/région (ex. Afrique de l’Ouest francophone, Afrique anglophone, Afrique de l’Est), tout en permettant à l’utilisateur de télécharger ces fichiers. Décris la landing page high-end d’AfriBrand AI avec une présentation claire de la vision, des valeurs (empowerment des PME africaines, respect des cultures locales, accessibilité économique), des bénéfices (gain de temps, cohérence de marque, contenus contextualisés), des objectifs, un aperçu des fonctionnalités clés (extraction du Business DNA, génération d’images et vidéos multi-styles, prévisualisations par plateforme, éditeur NL, export de calendriers, previews multi-plateformes) ainsi qu’une section tarifs adaptée aux réalités locales : offre Lite à 5 000 FCFA/mois, Pro à 15 000 FCFA/mois, Enterprise sur devis pour agences et grands comptes ; inclure un footer mentionnant clairement “AfriBrand AI — Propriété de Malthus AMETEPE”. Spécifie des pages d’authentification sécurisées (inscription, connexion, reset de mot de passe, gestion de session), un espace personnel “Brand HQ” où chaque PME gère son Business DNA, ses campagnes et ses assets, un système de newsletters configurables (segmentation par pays, secteur, langue, type de PME) et une documentation claire (README) listant : 1) les fonctionnalités déjà implémentées (extraction du Business DNA, génération d’images et vidéos, éditeur NL, export de calendriers CSV/ICS, Social Preview multi-plateformes), 2) celles en cours (intégration des APIs Meta/WhatsApp pour la publication directe sur Facebook, Instagram et WhatsApp Business), 3) une roadmap à 90 jours comprenant au minimum : intégration du WhatsApp Business Catalog, collaboration multi-utilisateurs pour les équipes/agences, génération de scripts vocaux en temps réel avec éventuelle synthèse vocale, et amélioration des recommandations d’horaires de publication. Chaque asset généré devra respecter des contraintes de poids optimisées pour les réalités africaines : images < 1 Mo, vidéos < 8 Mo sans perte de qualité perçue, et se conformer aux réglementations locales (protection des données, respect des cultures, religions, genres et communautés, absence de contenus haineux ou discriminatoires). L’interface devra être épurée, premium, mobile-first, avec une identité visuelle forte, des icônes graphiques professionnelles (sans emojis), une navigation intuitive avec navbar claire (accueil, produit, tarifs, documentation, connexion/espace client), des transitions fluides et un mode sombre si pertinent pour l’usage mobile nocturne. Documente dans une spécification technique détaillée la stack technologique recommandée (par ex. frontend React/Next.js ou équivalent, backend Node.js/NestJS ou Django, base de données SQL/NoSQL, stockage d’assets, intégration aux APIs Google Gemini et Gemini Veo, APIs des fournisseurs de paiement locaux, intégrations potentielles Meta/WhatsApp, TikTok, etc.), les APIs nécessaires, les coûts d’infrastructure estimatifs (en tenant compte du trafic africain, de l’optimisation des requêtes IA et du stockage), ainsi que 3 exemples concrets d’usage pour des secteurs clés : agro-transformation (ex. coopérative de transformation de manioc ou cacao), mode/textile (marque de vêtements ou pagnes africains), fintech/mobile money (solution de paiement ou wallet), en détaillant pour chacun comment AfriBrand AI extrait le Business DNA, propose des campagnes contextualisées et génère des assets adaptés aux plateformes sociales utilisées par ces secteurs.
