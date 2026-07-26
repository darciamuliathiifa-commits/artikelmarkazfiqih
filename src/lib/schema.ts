const SITE_URL = "https://markazfiqih.com";

export function organizationSchema({
  address,
  email,
  tagline,
  socialUrls,
}: {
  address: string;
  email: string;
  tagline: string;
  socialUrls: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Markaz Fiqih",
    url: SITE_URL,
    slogan: tagline,
    ...(address ? { address } : {}),
    ...(email ? { email } : {}),
    sameAs: socialUrls.filter(Boolean),
  };
}

export function articleSchema({
  title,
  description,
  url,
  thumbnailUrl,
  authorName,
  publishedAt,
}: {
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  authorName: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [thumbnailUrl],
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Markaz Fiqih",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function qaSchema({
  question,
  answer,
  url,
  authorName,
}: {
  question: string;
  answer: string;
  url: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question,
      text: question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
        author: {
          "@type": "Person",
          name: authorName,
        },
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function personSchema({
  name,
  description,
  url,
  imageUrl,
}: {
  name: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    ...(description ? { description } : {}),
    url,
    ...(imageUrl ? { image: imageUrl } : {}),
    worksFor: {
      "@type": "Organization",
      name: "Markaz Fiqih",
      url: SITE_URL,
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
