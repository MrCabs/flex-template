export default interface TermsAndConditionConfig {
  enabled: boolean;
  recordings: {
    url: string;
    name: string;
  }[];
}
