class AvatarSerice {
   private static readonly DEFAULT_AVATAR_UUID = "c06f89064c8a49119c29ea1dbd1aab82"

   public async getAvatarUrlForNickname(nickname: string): Promise<string> {
      try {
         let response: any = await (await fetch(`https://api.mojang.com/users/profiles/minecraft/${nickname}`)).json()
         if (response.id) {
            return this.getAvatarUrl(response.id)
         }
      } catch (_) { }

      return this.getAvatarUrl(AvatarSerice.DEFAULT_AVATAR_UUID)
   }

   private getAvatarUrl(uuid: string): string {
      return `https://crafatar.com/avatars/${uuid}?size=150&overlay`
   }

   public getDefaultAvatarUrl(): string {
      return this.getAvatarUrl(AvatarSerice.DEFAULT_AVATAR_UUID)
   }
}

export const avatarService = new AvatarSerice()