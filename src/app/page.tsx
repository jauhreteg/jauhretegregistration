"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AnimatedBinaryBackground from "@/components/animated-binary-background";
import { RegistrationModal } from "./register/_components/registration-modal";
import { activeConfig } from "@/config/website";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button as UIButton } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showFullRules, setShowFullRules] = useState(false);
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  const handleStartRegistration = () => {
    if (activeConfig.registration.enableTermsPopup) {
      setShowModal(true);
    } else {
      router.push("/register");
    }
  };

  const handleProceed = () => {
    router.push("/register");
    setShowModal(false);
  };

  // Registration modal sections
  const modalSections = [
    {
      title: "Registration Requirements",
      content: (
        <div>
          <p className="mb-2">
            By registering, you agree that your team will follow all competition
            rules including:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>All players must be from the same Akhara</li>
            <li>Team photos must be taken in bana with Ustad (no collages)</li>
            <li>Age verification documents required for all players</li>
            <li>Substitute player rules and restrictions</li>
          </ul>
          <p className="text-sm text-red-600 font-semibold mt-3">
            Note: Your team will not be fully registered until your Ustad and
            Jauhr E Teg sevadars approve your submission.
          </p>
        </div>
      ),
      agreementText: "I have read and agree to the Registration Requirements",
      isAgreed: agreedToRules,
      onAgreementChange: setAgreedToRules,
      showFullContent: activeConfig.registration.showFullTermsLinks,
      onShowFullContent: () => setShowFullRules(true),
      fullContentButtonText: "Read full Registration Requirements",
    },
    {
      title: "Medical Disclaimer & Waiver",
      content: (
        <div>
          <p className="mb-2">
            By participating in Jauhr E Teg activities, you acknowledge and
            accept:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              Gatka is a physical martial art with inherent risks of injury
            </li>
            <li>
              You waive liability claims against organizers and volunteers
            </li>
            <li>
              You assume all risks including injury, illness, or property damage
            </li>
            <li>This waiver is legally binding even in cases of negligence</li>
          </ul>
        </div>
      ),
      agreementText: "I have read and agree to the Medical Disclaimer & Waiver",
      isAgreed: agreedToDisclaimer,
      onAgreementChange: setAgreedToDisclaimer,
      showFullContent: activeConfig.registration.showFullTermsLinks,
      onShowFullContent: () => setShowFullDisclaimer(true),
      fullContentButtonText: "Read full Medical Disclaimer & Waiver",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      {/* Admin Login Button - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={() => router.push("/admin/login")}
          variant="outline"
          className={`px-4 py-2 text-xs font-semibold uppercase rounded-lg transition-colors ${
            activeConfig.effects.enableFastTransitions
              ? "duration-75"
              : "duration-300"
          } font-montserrat border-black text-black hover:bg-black hover:text-white`}
        >
          Admin Login
        </Button>
      </div>

      {/* Animated Binary Background */}
      {activeConfig.background.enableBinaryAnimation && (
        <AnimatedBinaryBackground
          textToConvert={activeConfig.background.binaryText}
          textColor="rgba(0, 0, 0, 0.05)"
          glowColors={["rgba(245, 166, 35, 0.8)", "rgba(0, 0, 0, 0.8)"]}
          fontSize="10px"
          glowIntensity={activeConfig.background.glowIntensity}
          glowInterval={activeConfig.background.animationSpeed}
          glowDuration={800}
          enableRadialFade={activeConfig.background.enableRadialFade}
        />
      )}

      {/* Main Content - Centered */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="flex items-center gap-12 max-w-4xl">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/jet-black.svg"
              alt="Jauhr E Teg Logo"
              width={200}
              height={200}
              className={`${
                activeConfig.layout.enableResponsiveSizing
                  ? "w-32 h-32 md:w-48 md:h-48"
                  : "w-48 h-48"
              } object-contain transition-all ${
                activeConfig.effects.enableFastTransitions
                  ? "duration-75"
                  : "duration-300"
              }`}
            />
          </div>

          {/* Content - Left Aligned */}
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase font-montserrat transition-colors duration-75 leading-tight">
                <div>JAUHR E TEG</div>
                <div>REGISTRATION</div>
              </h1>
            </div>

            <Button
              onClick={handleStartRegistration}
              className={`mt-6 px-6 py-2 text-sm font-semibold uppercase rounded-lg transition-colors ${
                activeConfig.effects.enableFastTransitions
                  ? "duration-75"
                  : "duration-300"
              } font-montserrat bg-black text-white ${
                activeConfig.effects.enableButtonHoverAnimation
                  ? "hover:bg-[#F5A623] hover:text-white"
                  : ""
              }`}
            >
              START REGISTRATION
            </Button>
          </div>
        </div>
      </div>

      {/* Copyright Text */}
      {activeConfig.layout.showCopyrightText && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <p
            className={`text-xs text-center opacity-20 transition-colors font-montserrat ${
              activeConfig.effects.enableFastTransitions
                ? "duration-75"
                : "duration-300"
            } text-black`}
          >
            © 2017-{new Date().getFullYear()} Jauhr E Teg
          </p>
        </div>
      )}

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        sections={modalSections}
        onProceed={handleProceed}
        requireBothAgreements={activeConfig.registration.requireBothAgreements}
      />

      {/* Full Rules Dialog */}
      <Dialog open={showFullRules} onOpenChange={setShowFullRules}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-montserrat">
              Registration Requirements
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4 font-montserrat">
            <p className="text-sm">
              To be fully registered, each team must adhere to the following
              rules. Any team that does not follow the rules below will be asked
              to resubmit, and their Ustad may be notified.
            </p>

            <div className="space-y-3">
              <h3 className="font-bold">Registration Rules:</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>All players must be part of the same Akhara</li>
                <li>
                  Team pictures must be taken in bana with Ustad and all players
                  in one picture, NO collages
                </li>
                <li>
                  You may add a substitute player in the case a player drops:
                  <ul className="list-disc pl-6 mt-1 space-y-1">
                    <li>
                      Substitute cannot be part of any other team, as a player
                      or substitute
                    </li>
                    <li>The substitute needs to be from the same Akhara</li>
                    <li>
                      If you do not have a substitute and a player drops, you
                      must compete with a team of 2
                    </li>
                  </ul>
                </li>
                <li>
                  To verify player age, all players must provide a photo of
                  their driver's license, state-issued ID, birth certificate, or
                  school document that shows full name and birthday.
                </li>
                <li>
                  All emails provided for players must be the player's personal
                  email for transparent communication between Jauhr E Teg team
                  and the players.
                </li>
              </ul>
            </div>

            <p className="text-sm text-red-600 font-semibold">
              Note: Your team will not be fully registered until your Ustad and
              Jauhr E Teg sevadars approve your submission. After submission,
              you will receive an email of approval or denial.
            </p>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <UIButton
                onClick={() => setShowFullRules(false)}
                className="uppercase font-montserrat"
              >
                Close
              </UIButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Disclaimer Dialog */}
      <Dialog open={showFullDisclaimer} onOpenChange={setShowFullDisclaimer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-montserrat">
              MEDICAL DISCLAIMER
            </DialogTitle>
            <DialogDescription className="text-center font-semibold font-montserrat">
              PLEASE READ & ACKNOWLEDGE
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4 font-montserrat">
            <p className="text-center font-semibold text-sm">
              Jauhr E Teg, California Gatka Dal, and Sikh Gurdwara San Jose
            </p>
            <p className="text-center italic text-sm">
              Release and Waiver of Liability, Assumption of Risk, and Indemnity
              Agreement
            </p>

            <div className="space-y-4 text-sm">
              <p>
                I understand, affirm, and agree that I voluntarily waive,
                release, indemnify, hold harmless, and discharge Jauhr E Teg,
                California Gatka Dal, and Sikh Gurdwara San Jose committee
                members, organizers, employees, volunteers, teachers, and their
                contracted entities involved at the facility, from any and all
                liability, claims, demands, actions, rights of actions, or legal
                proceedings whatsoever, whether personal to my child and/or me
                and/or to a third party should I and/or my child become injured
                (whether physically or emotionally) or cause injury to others,
                while participating (whether supervised or unsupervised), at
                Jauhr E Teg activities, Gatka practices, and competitions. I
                understand that this WAIVER is binding even if any injury, loss,
                damage, or death should be caused by genuine negligence.
              </p>

              <p>
                I understand and acknowledge that my participation or my child's
                participation may involve the use of equipment and gear, as well
                as myself or my child being situated in areas where active
                sports, recreation, and other activities such as Gatka are
                engaged in, as well as circulation and participation with other
                guests and others on-site and that such participation brings
                both known and unanticipated risks to myself, to my child, and
                others, which could result in injury, illness, disease,
                emotional distress, death, and or property damage to myself, my
                child, or to others.
              </p>

              <p>Such injuries could include (but are not limited to):</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>
                  injury during playing Gatka, hitting sports equipment poles
                  and projections, or the floor;
                </li>
                <li>being struck by any physical equipment;</li>
                <li>
                  cuts and abrasions from skin contact with equipment, surfaces,
                  or other guests;
                </li>
                <li>
                  sprain, twisting, or other injury to limbs due to the
                  above-mentioned activities in the first paragraph of this
                  form;
                </li>
                <li>
                  other injuries without limitation whether or not specified
                  here.
                </li>
              </ol>

              <p>
                I acknowledge, affirm, and agree that I have had sufficient
                opportunity to read this entire waiver of my rights, that I
                understand its content, that it is legally binding, and that I
                execute freely, intelligently, and without duress of any kind. I
                agree to be bound by its terms.
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <UIButton
                onClick={() => setShowFullDisclaimer(false)}
                className="uppercase font-montserrat"
              >
                Close
              </UIButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
