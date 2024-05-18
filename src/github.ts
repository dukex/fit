class Github {
	async getUser(): Promise<{ owner: string; avatarUrl: string }> {
		try {
			const { data: response } = await this.octokit.request(`GET /user`, {
				headers: this.headers,
			});
			return { owner: response.login, avatarUrl: response.avatar_url };
		} catch (error) {
			throw new OctokitHttpError(error.message, error.status, "getUser");
		}
	}
}
