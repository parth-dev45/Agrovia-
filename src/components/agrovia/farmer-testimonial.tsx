interface TestimonialProps {
  name: string;
  location: string;
  farmSize: string;
  crop: string;
  testimonial: string;
  photo: string;
  results: Array<{
    value: string;
    label: string;
  }>;
}

const FarmerTestimonial = ({
  name,
  location,
  farmSize,
  crop,
  testimonial,
  photo,
  results
}: TestimonialProps) => (
  <div className="bg-card rounded-xl p-6 border shadow-lg">
    {/* Header with farmer details */}
    <div className="flex items-start gap-4 mb-4">
      <img
        src={photo}
        alt={name}
        className="w-16 h-16 rounded-full object-cover border-2 border-primary"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-lg">{name}</h4>
        <p className="text-sm text-muted-foreground">{location}</p>
        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
          <span>🌾 {farmSize} acres</span>
          <span>🥬 {crop}</span>
        </div>
      </div>
      {/* Star rating */}
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">⭐</span>
        ))}
      </div>
    </div>
    
    {/* Testimonial text */}
    <blockquote className="text-foreground mb-4 italic">
      "{testimonial}"
    </blockquote>
    
    {/* Results metrics */}
    <div className="grid grid-cols-2 gap-3 pt-4 border-t">
      {results.map((result, idx) => (
        <div key={idx} className="text-center">
          <p className="text-2xl font-bold text-primary">{result.value}</p>
          <p className="text-xs text-muted-foreground">{result.label}</p>
        </div>
      ))}
    </div>
  </div>
);

// Example usage component
const TestimonialShowcase = () => (
  <section className="py-16 px-4 bg-muted/30">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Real Stories from Real Farmers
        </h2>
        <p className="text-muted-foreground text-lg">
          See how AgroVia is transforming agriculture across India
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FarmerTestimonial
          name="Rajesh Kumar"
          location="Nashik, Maharashtra"
          farmSize="12"
          crop="Organic Tomatoes"
          photo="/api/placeholder/64/64"
          testimonial="AgroVia helped me get 25% better prices because buyers could verify my organic certification and see the exact harvest date. Game changer!"
          results={[
            { value: "+25%", label: "Better Prices" },
            { value: "35%", label: "Less Waste" },
            { value: "₹2.5L", label: "Extra Income" },
            { value: "100%", label: "Verified Quality" },
          ]}
        />
        
        <FarmerTestimonial
          name="Priya Sharma"
          location="Ludhiana, Punjab"
          farmSize="25"
          crop="Wheat & Rice"
          photo="/api/placeholder/64/64"
          testimonial="The IoT sensors helped me optimize irrigation and reduce water usage by 40%. My crops are healthier and I'm saving money on water bills."
          results={[
            { value: "40%", label: "Water Saved" },
            { value: "₹1.8L", label: "Cost Savings" },
            { value: "15%", label: "Higher Yield" },
            { value: "24/7", label: "Monitoring" },
          ]}
        />
        
        <FarmerTestimonial
          name="Suresh Patel"
          location="Anand, Gujarat"
          farmSize="8"
          crop="Organic Vegetables"
          photo="/api/placeholder/64/64"
          testimonial="Retailers now trust my produce completely. The blockchain verification shows them exactly how my vegetables were grown and handled."
          results={[
            { value: "50%", label: "More Orders" },
            { value: "₹3.2L", label: "Annual Revenue" },
            { value: "0%", label: "Rejected Batches" },
            { value: "95%", label: "Customer Retention" },
          ]}
        />
      </div>
    </div>
  </section>
);

export default FarmerTestimonial;
export { TestimonialShowcase };