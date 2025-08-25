import Head from 'next/head';

// Layout component for consistent page structure and SEO metadata
const Layout = ({ children, title, description, keywords, structuredData }) => {
  return (
    <div className="min-h-screen bg-secondary-white font-inter text-text-dark">
      <Head>
        {/* Dynamic title for SEO */}
        <title>{title || "Interview Question Analyzer from Job Descriptions"}</title>
        {/* Dynamic meta description for SEO */}
        <meta name="description" content={description || "Analyze job descriptions, generate interview questions, identify skill gaps, and practice with an AI interviewer. Get ready for your next job interview!"} />
        {/* Dynamic keywords for SEO */}
        <meta name="keywords" content={keywords || "job description analyzer, interview questions, skill gap analysis, AI mock interview, ATS-friendly resume, job preparation, career tools, technical interview, behavioral interview"} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" /> {/* Favicon */}
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content={title || "Interview Question Analyzer"} />
        <meta property="og:description" content={description || "AI-powered tool to ace your next job interview."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-app-url.vercel.app/" /> {/* Replace with your deployed URL */}
        <meta property="og:image" content="https://your-app-url.vercel.app/social-image.jpg" /> {/* Replace with a relevant image */}

        {/* Structured Data for rich snippets in Google Search Results */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        )}
      </Head>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {children} {/* Renders the content passed to the Layout component */}
      </main>
    </div>
  );
};

export default Layout;
