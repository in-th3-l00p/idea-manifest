import { Section } from "../../components/Section";
import { ProfileView } from "../../components/profile/ProfileView";

export default function Page() {
  return (
    <Section title="profile" subtitle="your identity and activity">
      <ProfileView />
    </Section>
  );
}


