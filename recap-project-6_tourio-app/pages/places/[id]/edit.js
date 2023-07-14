import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import Form from "../../../components/Form.js";
import { StyledLink } from "../../../components/StyledLink.js";

export default function EditPage() {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;
  const { push } = router; // icke
  const { data: place, isLoading, error } = useSWR(`/api/places/${id}`);
  const { trigger, isMutating } = useSWRMutation(
    `/api/places/${id}`,
    sendRequest
  );
  async function sendRequest(url, { arg }) {
    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(arg),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      await response.json();
    } else {
      console.error(`Error: ${response.status}`);
    }
  }
  async function editPlace(place) {
    console.log("Place edited (but not really...");
    await trigger(place);
    push("/");
    if (isMutating) {
      return <h1>Submitting your changes...</h1>;
    }
  }
  if (!isReady || isLoading || error) return <h2>Loading...</h2>;
  return (
    <>
      <h2 id="edit-place">Edit Place</h2>
      <Link href={`/places/${id}`} passHref legacyBehavior>
        <StyledLink justifySelf="start">back</StyledLink>
      </Link>
      <Form onSubmit={editPlace} formName={"edit-place"} defaultData={place} />
    </>
  );
}
