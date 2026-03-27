export declare class LandingController {
    renderLanding(): {
        modules: ({
            title: string;
            slug: string;
            swaggerLink: string;
            icon: string;
            status: string;
            comingSoon?: undefined;
        } | {
            title: string;
            slug: string;
            swaggerLink: string;
            icon: string;
            comingSoon: boolean;
            status: string;
        })[];
    };
    stayTuned(slug: string): {
        slug: string;
    };
}
