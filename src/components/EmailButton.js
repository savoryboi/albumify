function EmailButton() {
    const email = 'andbjerk@yahoo.com';
    const subject = 'Albumify Acess Request';
    const body = 'Please enter the email address linked to your Spoify account. '

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <button onClick={handleEmailClick}>Request Access</button>
  );
}

export default EmailButton;
