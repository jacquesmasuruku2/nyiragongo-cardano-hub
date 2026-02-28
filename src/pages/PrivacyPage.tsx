const PrivacyPage = () => {
  return (
    <div>
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
          <p className="text-muted-foreground max-w-2xl">
            Notre engagement envers la protection de vos données personnelles.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cardano Nyiragongo Hub s'engage à protéger la vie privée de ses utilisateurs. 
                Cette politique de confidentialité explique comment nous collectons, utilisons et 
                protégeons vos informations personnelles lorsque vous utilisez nos services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Données Collectées</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nous collectons les informations suivantes :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Nom et adresse email (inscription newsletter)</li>
                <li>Informations de profil (compte utilisateur)</li>
                <li>Données d'utilisation du site</li>
                <li>Informations de contact (formulaire de contact)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Utilisation des Données</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Fournir nos services et améliorer l'expérience utilisateur</li>
                <li>Envoyer notre newsletter et communications</li>
                <li>Répondre à vos demandes et questions</li>
                <li>Analyser l'utilisation de notre site</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Protection des Données</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger 
                vos données personnelles contre l'accès non autorisé, la modification, 
                la divulgation ou la destruction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Vos Droits</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vous avez le droit de :
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier vos données inexactes</li>
                <li>Supprimer vos données personnelles</li>
                <li>Vous opposer au traitement de vos données</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                Pour toute question concernant cette politique de confidentialité ou 
                l'exercice de vos droits, veuillez nous contacter à :
              </p>
              <p className="text-muted-foreground">
                Email : contact@cardanonyiragongo.com<br />
                Téléphone : +243 975 652 545
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Mise à Jour</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cette politique de confidentialité peut être mise à jour périodiquement. 
                Nous vous informerons de tout changement important par le biais de notre site.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
